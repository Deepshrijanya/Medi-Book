import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10 border-t border-teal_tint pt-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>

        {/*----left----- */}

        <div>
          <img className='mb-5 w-44' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-text_secondary leading-relaxed font-medium'>
            MediBook is dedicated to providing excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve your experience.
          </p>
        </div>


        {/*----center----- */}

        <div>
          <p className='text-xl font-bold text-text_primary mb-5 uppercase tracking-wider'>Company</p>
          <ul className='flex flex-col gap-2 text-text_secondary font-medium'>
            <li className='hover:text-primary cursor-pointer transition-colors'>Home</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>About Us</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>Contact Us</li>
            <li className='hover:text-primary cursor-pointer transition-colors'>Privacy Policy</li>
          </ul>
        </div>


        {/*----right----- */}

        <div>
          <p className='text-xl font-bold text-text_primary mb-5 uppercase tracking-wider'>Get In Touch</p>
          <ul className='flex flex-col gap-2 text-text_secondary font-medium'>
            <li>+1-212-456-7890</li>
            <li>support@medibook.ai</li>
          </ul>
        </div>
      </div>

      {/*----copyright text---*/}
      <div className='border-t border-teal_tint/50'>
        <p className='py-6 text-sm text-center text-text_muted font-medium'>Copyright 2024 @ MediBook - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
