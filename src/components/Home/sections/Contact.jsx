import React from "react"
import Lottie from 'lottie-react'
import animecontact from '/public/contactanime.json'
import toast from "react-hot-toast"
import { useState } from "react"
import Loader from "@/components/utlis/Loader"
import { set } from "mongoose"

export default () => {
const[firstName,setFirstName] = useState('')
const[lastName,setLastName] = useState('')
const[email,setEmail] = useState('')
const[phone,setPhone] = useState(null)
const[message,setMessage] = useState('') 
const [loading,setLoading] = useState(false)

    const handlesubmit = async(e) => {
        setLoading(true)
        e.preventDefault()
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName: firstName ,lastName:lastName,email:email,phone:phone,message:message}),
          });
          if(response.ok){
            setLoading(false)
            toast.success('Submitted')
            setFirstName('')
            setEmail('')
            setLastName('')
            setPhone('')
            setMessage('')
          }else{
            setLoading(false)
            toast.error('failed')
          }
    }
    return (
        <main id="contact" className="py-20 flex w-full h-screen">

{loading && <Loader/>}
<div className="w-1/2 h-full py-20 flex justify-center items-center">
<Lottie animationData={animecontact} className=" "/>

      </div>



            <div className="w-1/2 mx-auto px-4  text-gray-600 md:px-8">
              
                <div className=" max-w-lg mx-auto">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5"
                    >
                        <h1 className=" text-2xl text-primary font-semibold">Contact us</h1>
                        <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                            <div>
                                <label className="font-medium">
                                    First name
                                </label>
                                <input
                                 value={firstName}
                                 onChange={(e) => setFirstName(e.target.value)}
                                    type="text"
                                    required
                                    className="w-full mt-2 px-3 py-2  text-primary bg-transparent outline-none border focus:border-[#792938] shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">
                                    Last name
                                </label>
                                <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                    type="text"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-primary  bg-transparent outline-none border focus:border-[#792938] shadow-sm rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-[#792938] shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Phone number
                            </label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                                    <select className="text-sm bg-transparent outline-none rounded-lg h-full">
                                        <option>India</option>
                                    </select>
                                </div>
                                <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                    type="number"
                                    placeholder="+91  xxxx-nnnnnn"
                                    required
                                    className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-[#792938] shadow-sm rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium">
                                Message
                            </label>
                            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} required className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-[#792938] shadow-sm rounded-lg"></textarea>
                        </div>
                        <button
                        onClick={handlesubmit}
                            className="w-full px-4 py-2 text-white font-medium bg-[#792938] hover:bg-[#792938] active:bg-[#792938] rounded-lg duration-150"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}