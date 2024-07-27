import { Auth } from '@/app/_components/Auth'
import { Search } from 'lucide-react'
import React from 'react'
import { auth, currentUser } from "@clerk/nextjs/server"
import { useSelector } from 'react-redux'

const Header = () => {
  const isSubscribed = useSelector((state) => {
    return state.userSubs.active
  })
  // const {userId } = auth()

  // const getUsername = async() =>{
  //   const user= await currentUser()
  //   return `${user?.firstName} ${user?.lastName}`
  // }
  // const userFullName = getUsername()


  return (
    <div className='p-5 shadow-sm border-b-2 flex justify-between items-center bg-white'>
      <div className='flex gap-2 items-center p-2 border rounded-md max-w-md bg-white'>
        {/* <Search/> */}
        {/* <input type='text' placeholder='Search...' className='outline-none'/> */}
        {/* {`Welcome! ${userFullName}`} */}
        {/* <Auth /> */}

      </div>
      <hr className='my-6 border' />
      <div className='mt-3'>

        <h2 className=' bg-primary p-1 rounded-full text-xs text-white px-2'>
          {isSubscribed ? `🔥 Thanks for a Premium Member 🔥 `: `🔥 Join Membership just for $9.99/Month 🔥`}
          
        </h2>

      </div>
    </div>
  )
}

export default Header