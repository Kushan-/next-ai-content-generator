'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'

import CreditUsageTracker from './CreditUsageTracker'

const SideNav = () => {


    const menuList = [
        {
            name: 'Home',
            icon: Home,
            path: '/dashboard'

        },
        {
            name: 'History',
            icon: FileClock,
            path: '/dashboard/history'

        }, {
            name: 'Subscribe',
            icon: WalletCards,
            path: '/dashboard/subscribe'

        }, {
            name: 'Settings',
            icon: Settings,
            path: '/dashboard/settings'

        }
    ]

    const path = usePathname()
    const pathname = usePathname()

    return (


        
        <div className='h-screen p-5 shadow-sm border bg-white relative'>
            <div className='flex justify-center'>
                <Image src={'/logo.svg'} alt='logo' width={120} height={100} />
            </div>

            <div className='mt-10'>
                {
                    menuList.map((menu, index) => (
                        <Link href={menu.path} key={menu.name}>
                            <div key={index} className={`flex gap-2 mb-2 p-3 hover:bg-primary hover:text-white 
                    rounded-lg cursor cursor-pointer items-center ${pathname == menu.path && 'bg-primary text-white'} ${menu.path == pathname}`}>


                                <menu.icon className='h6 w-6' />

                                <h2 className='text-lg'>{menu.name}</h2>

                            </div>
                        </Link>

                    ))
                }
            </div>
            <div className='absolute bottom-10'>
                
                <CreditUsageTracker />
            </div>

        </div>
    )
}

export default SideNav