import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className="text-center text-3xl pt-10 text-text_muted">
        <p className='font-light italic'>
          ABOUT <span className="text-text_primary font-bold not-italic">US</span>
        </p>
      </div>

      <div className="my-12 flex flex-col md:flex-row gap-16 items-center">
        <img
          className="w-full md:max-w-[400px] rounded-[30px] shadow-2xl border-8 border-white"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-8 md:w-2/4 text-sm text-text_secondary leading-relaxed">
          <p>
            Welcome to <span className='text-primary font-bold'>MediBook</span>, your trusted partner in managing your
            healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            MediBook is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, we are here to support you every step of the way.
          </p>
          <div className='bg-teal_tint p-6 rounded-2xl border-l-4 border-primary'>
            <b className="text-text_primary text-lg mb-2 block">Our Vision</b>
            <p className='italic'>
              Our vision is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between patients
              and healthcare providers, making it easier for you to access the
              care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      <div className="text-2xl my-8 text-text_primary font-bold">
        <p>
          WHY <span className="text-primary">CHOOSE US</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mb-28 gap-0 border border-teal_tint rounded-[20px] overflow-hidden shadow-sm">
        <div className="bg-ivory px-10 md:px-16 py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-text_secondary cursor-pointer border-b md:border-b-0 md:border-r border-teal_tint group">
          <b className='text-text_primary group-hover:text-white text-lg transition-colors'>Efficiency:</b>
          <p className='group-hover:text-white/90 transition-colors'>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className="bg-ivory px-10 md:px-16 py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-text_secondary cursor-pointer border-b md:border-b-0 md:border-r border-teal_tint group">
          <b className='text-text_primary group-hover:text-white text-lg transition-colors'>Convenience:</b>
          <p className='group-hover:text-white/90 transition-colors'>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className="bg-ivory px-10 md:px-16 py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-text_secondary cursor-pointer group">
          <b className='text-text_primary group-hover:text-white text-lg transition-colors'>Personalization:</b>
          <p className='group-hover:text-white/90 transition-colors'>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
