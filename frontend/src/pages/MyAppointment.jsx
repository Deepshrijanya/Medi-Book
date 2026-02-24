import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointment = () => {


  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]



  const slotDateFormat = (slotDate) => {

    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }


    } catch (error) {

      console.log(error)
      toast.error(error.message)

    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()

      } else {
        toast.error(data.message)
      }

    } catch (error) {

      console.log(error)
      toast.error(error.message)
    }
  }

  const initpay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)

        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  const appointmentRazorpay = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })

      if (data.success) {
        initpay(data.order)
      }

    } catch (error) {

    }
  }


  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className='max-w-4xl mx-auto'>
      <p className='pb-4 mt-12 font-bold text-2xl text-text_primary border-b border-teal_tint'>My Appointments</p>
      <div className='mt-8 space-y-6'>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-6 sm:flex sm:gap-8 p-6 bg-white border border-teal_tint rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300' key={index}>
            <div className='flex-shrink-0'>
              <img className='w-32 sm:w-40 bg-teal_tint rounded-xl shadow-inner' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-text_secondary'>
              <p className='text-text_primary text-xl font-bold'>{item.docData.name}</p>
              <p className='text-accent font-medium uppercase tracking-wider text-xs mt-1'>{item.docData.speciality}</p>
              <div className='mt-4 space-y-1'>
                <p className='text-text_primary font-bold'>Address:</p>
                <p className='text-xs leading-relaxed'>{item.docData.address.line1}</p>
                <p className='text-xs leading-relaxed'>{item.docData.address.line2}</p>
              </div>
              <p className='text-xs mt-4 flex items-center gap-2'><span className='text-sm text-text_primary font-bold'>Date & Time:</span> <span className='bg-ivory px-3 py-1 rounded-lg border border-teal_tint font-medium'>{slotDateFormat(item.slotDate)} | {item.slotTime}</span></p>
            </div>
            <div className='flex flex-col gap-3 justify-end sm:min-w-48'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='w-full py-3 border border-teal_tint rounded-xl text-primary bg-teal_tint font-bold shadow-sm'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-white text-center w-full py-3 bg-primary rounded-xl hover:bg-secondary transition-all duration-300 font-bold shadow-md'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-text_muted text-center w-full py-3 border border-teal_tint rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 font-medium'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='w-full py-3 border border-red-200 rounded-xl text-red-500 bg-red-50 font-bold'>Appointment Cancelled</button>}
              {item.isCompleted && <button className='w-full py-3 border border-accent rounded-xl text-accent bg-accent/10 font-bold'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointment
