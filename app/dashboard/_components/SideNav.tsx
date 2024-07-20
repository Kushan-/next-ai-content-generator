'use client'
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

import CreditUsageTracker from './CreditUsageTracker'

const SideNav = () => {


    const menuList = [
        {
            name: 'Home',
            icon: Home,
            pathname: '/dasboard'

        },
        {
            name: 'History',
            icon: FileClock,
            pathname: '/dasboard/history'

        }, {
            name: 'Billing',
            icon: WalletCards,
            pathname: '/dasboard/billing'

        }, {
            name: 'Setting',
            icon: Settings,
            pathname: '/dasboard/setting'

        }
    ]

    const path = usePathname()
    const pathname = usePathname()

    return (


        <div className='h-screen p-5 shadow-sm border bg-white relative'>
            <div className='flex justify-center'>
                <Image src={'/logo.svg'} alt='logo' width={120} height={100} />
            </div>
            <ul className='mt-10'>
                {
                    menuList.map((menu, index) => (
                        <Link  key={index} href={menu.pathname}>
                        <li key={index} className={`flex gap-2 mb-2 p-3 hover:bg-primary hover:text-white 
                    rounded-lg cursor cursor-pointer items-center ${pathname == menu.pathname && 'bg-cyan text-white'} ${menu.pathname == pathname}`}>
                            
                            
                                <menu.icon className='h6 w-6' />

                                <h2 className='text-lg'>{menu.name}</h2>
                            
                        </li>
                        </Link>
                    ))
                }
            </ul>
            <div className='absolute bottom-10'>
                <CreditUsageTracker/>
            </div>

        </div>
    )
}

export default SideNav