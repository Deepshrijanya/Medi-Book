import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)

  }


  const getAvailableSlots = async () => {
    setDocSlots([])

    // getting current date

    let today = new Date()

    for (let i = 1; i <= 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date with index

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })


        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()


        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }





        // increment current time by 30 minute
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }

  }


  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {

      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }







  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots])

  return docInfo && (
    <div>
      {/* ---  doctors details------*/}
      <div className='flex flex-col sm:flex-row gap-8'>
        <div className='flex-shrink-0'>
          <img className='bg-primary w-full sm:max-w-72 rounded-[20px] shadow-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-teal_tint rounded-[20px] p-8 py-7 bg-ivory shadow-sm mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*----doc info:name,degree,experience -----*/}
          <p className='flex items-center gap-2 text-3xl font-bold text-text_primary'>{docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-text_secondary'>
            <p className='font-medium'>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-3 border border-teal_tint text-xs rounded-full bg-white shadow-sm'>{docInfo.experience}</button>
          </div>
          {/*--------doctor about ------*/}
          <div className='mt-6'>
            <p className='flex items-center gap-1 text-sm font-bold text-text_primary'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-text_secondary max-w-[700px] mt-1 leading-relaxed'>{docInfo.about}</p>
          </div>
          <p className='text-text_muted font-medium mt-6'>Appointment fee: <span className='text-text_primary font-bold'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/*--------booking slot------*/}
      <div className='sm:ml-80 sm:pl-4 mt-8 font-medium text-text_secondary'>
        <p className='text-lg font-bold text-text_primary'>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-2 scrollbar-hide'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-[20px] cursor-pointer transition-all duration-300 shadow-sm ${slotIndex === index ? 'bg-primary text-white scale-105' : 'bg-white border border-teal_tint text-text_muted hover:bg-teal_tint'}`} key={index}>
                <p className='text-xs uppercase'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className='text-lg font-bold'>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 pb-2 scrollbar-hide'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-medium flex-shrink-0 px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-primary text-white shadow-md' : 'bg-white text-text_muted border border-teal_tint hover:bg-teal_tint'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-bold px-14 py-4 rounded-xl my-8 hover:bg-secondary transition-all duration-300 shadow-lg active:scale-95'>Book an appointment</button>
      </div>
      {/*---------------listing related doctors---------------*/}

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
