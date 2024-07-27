import { Auth } from '@/app/_components/Auth'
import { Search } from 'lucide-react'
import React from 'react'
import { auth, currentUser } from "@clerk/nextjs/server"
import { useSelector } from 'react-redux'
import { UserButton } from '@clerk/clerk-react'
import { useUser } from "@clerk/clerk-react"
import {STATEUSERSUBS} from './CreditUsageTracker'


const Header = () => {
  const isSubscribed = useSelector((state:STATEUSERSUBS) => {
    return state.userSubs.active
  })
  const { user } = useUser()
  const userId = user?.id
  const userEmailId = user?.primaryEmailAddress?.emailAddress
  const userFullName = user?.fullName

  return (
    <div className='p-5 shadow-sm border-b-2 flex justify-between items-center bg-white'>
      <div className='flex gap-2 items-center p-2 border rounded-md max-w-md bg-white'>

        {/* <Search/> */}
        {/* <input type='text' placeholder='Search...' className='outline-none'/> */}
        <h2>{`👋💗 Welcome! ${userFullName} 👋🏻`}</h2>

      </div>
      <hr className='my-6 border' />
      <div className='flex gap-5 items-center'>

        <h2 className=' bg-primary p-1 rounded-full text-xs text-white px-2'>
          {isSubscribed ? `🔥 Thanks for a Premium Member 🔥 `: `🔥 Join Membership just for $9.99/Month 🔥`}
          
        </h2>
        <UserButton/>
      </div>
    </div>
  )
}

export default Header