import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center text-3xl pt-10 text-text_muted'>
          <p className='font-light italic'>CONTACT <span className='text-text_primary font-bold not-italic'>US</span></p>
        </div>

        <div className='my-16 flex flex-col justify-center md:flex-row gap-16 mb-28 items-center'>
          <img className='w-full md:max-w-[400px] rounded-[30px] shadow-2xl border-8 border-white' src={assets.contact_image} alt="" />
          <div className='flex flex-col justify-center items-start gap-8 bg-ivory p-8 md:p-12 rounded-[20px] shadow-sm border border-teal_tint'>
            <div>
              <p className='font-bold text-xl text-text_primary mb-4 uppercase tracking-widest border-b-2 border-primary inline-block pb-1'>Our Office</p>
              <p className='text-text_secondary leading-relaxed font-medium'>54709 Willms Station<br /> Suite 350, Washington, USA</p>
            </div>
            <div>
              <p className='text-text_secondary leading-relaxed font-medium'>Tel: (415) 555-0132</p>
              <p className='text-text_secondary leading-relaxed font-medium'>Email: support@medibook.ai</p>
            </div>
            <div>
              <p className='font-bold text-xl text-text_primary mb-4 uppercase tracking-widest border-b-2 border-primary inline-block pb-1'>Careers at MediBook</p>
              <p className='text-text_secondary leading-relaxed font-medium mb-6'>Learn more about our teams and job openings.</p>
              <button className='border-2 border-primary text-primary px-10 py-4 text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-500 shadow-sm'>Explore Jobs</button>
            </div>
          </div>
        </div>
      </div>




    </div>
  )
}

export default Contact
