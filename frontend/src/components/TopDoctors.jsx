import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 mdLmx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors</p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => (
          <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-teal_tint bg-ivory rounded-[20px] overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-lg group' key={index}>
            <img className='bg-teal_tint w-full group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-accent' : 'text-text_muted'} `}>
                <p className={`w-2 h-2 ${item.available ? 'bg-accent' : 'bg-text_muted'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-text_primary text-lg font-bold'>{item.name}</p>
              <p className='text-text_secondary text-sm font-medium'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-primary text-white px-12 py-3 rounded-xl mt-10 hover:bg-secondary transition-all duration-300 shadow-md font-medium'>more</button>
    </div>
  )
}

export default TopDoctors
