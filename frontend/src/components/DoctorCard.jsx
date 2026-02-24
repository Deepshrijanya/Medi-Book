import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => { navigate(`/appointment/${doctor._id}`); window.scrollTo(0, 0) }}
            className='border border-teal_tint bg-ivory rounded-[20px] overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-lg min-w-[200px] group'
        >
            <img className='bg-teal_tint w-full group-hover:bg-primary transition-all duration-500' src={doctor.image} alt={doctor.name} />
            <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${doctor.available ? 'text-accent' : 'text-text_muted'}`}>
                    <p className={`w-2 h-2 ${doctor.available ? 'bg-accent' : 'bg-text_muted'} rounded-full`}></p>
                    <p>{doctor.available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-text_primary text-lg font-bold'>{doctor.name}</p>
                <p className='text-text_secondary text-sm font-medium'>{doctor.speciality}</p>
            </div>
        </div >
    )
}

export default DoctorCard
