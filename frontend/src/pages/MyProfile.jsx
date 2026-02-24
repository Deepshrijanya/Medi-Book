import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {

      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {
        isEdit
          ? <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className="w-10 absolute bottom-12 right-12" src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className="w-36 rounded" src={userData.image} alt="" />
      }



      {isEdit ? (
        <input className="bg-teal_tint text-3xl font-bold max-w-60 mt-4 px-2 py-1 rounded-lg text-text_primary outline-none border border-primary/20"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-bold text-3xl text-text_primary mt-4">{userData.name}</p>
      )}

      <hr className="bg-teal_tint h-[1px] border-none my-4" />
      <div>
        <p className="text-text_muted font-bold text-xs uppercase tracking-widest mb-4">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-text_secondary">
          <p className="font-bold text-text_primary">Email id:</p>
          <p className="text-accent font-medium">{userData.email}</p>
          <p className="font-bold text-text_primary">Phone:</p>
          {isEdit ? (
            <input className="bg-teal_tint max-w-52 px-2 py-1 rounded-lg outline-none border border-primary/20"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-accent font-medium">{userData.phone}</p>
          )}
          <p className="font-bold text-text_primary">Address:</p>
          {
            isEdit
              ? <div className="space-y-2">
                <input className='bg-teal_tint w-full px-2 py-1 rounded-lg outline-none border border-primary/20' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} type="text" />
                <input className='bg-teal_tint w-full px-2 py-1 rounded-lg outline-none border border-primary/20' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} type="text" />
              </div>
              : <p className='text-text_secondary font-medium'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }
        </div>
      </div>
      <div className="mt-8">
        <p className="text-text_muted font-bold text-xs uppercase tracking-widest mb-4">Basic Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-4 text-text_secondary'>
          <p className="font-bold text-text_primary">Gender:</p>
          {
            isEdit
              ? <select className="max-w-32 bg-teal_tint px-2 py-1 rounded-lg outline-none border border-primary/20 font-medium" onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className="text-text_secondary font-medium">{userData.gender}</p>
          }
          <p className="font-bold text-text_primary">Birthday:</p>
          {
            isEdit
              ? <input className="max-w-40 bg-teal_tint px-2 py-1 rounded-lg outline-none border border-primary/20 font-medium" type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
              : <p className="text-text_secondary font-medium">{userData.dob}</p>

          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
            ? <button className="bg-primary text-white px-10 py-3 rounded-xl hover:bg-secondary transition-all shadow-md font-bold text-sm" onClick={updateUserProfileData}>Save Information</button>
            : <button className="border border-primary text-primary px-10 py-3 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm font-bold text-sm" onClick={() => setIsEdit(true)}>Edit Profile</button>

        }
      </div>
    </div>
  );
};

export default MyProfile;
