'use client'
import React from 'react'

import SideNav from './_components/SideNav'
import Header from './_components/Header'
import { Provider } from 'react-redux'
import reduxStore from '@/store'

const layout = ( {children} : Readonly<{children:React.ReactNode}> ) => {
  return (
    <Provider store={reduxStore}>
    <div className='bg-slate-50 h-screen'>
        <div className='md:w-64 hidden md:block fixed'>
            <SideNav/>
        </div>
        <div className='md:ml-64'>
            <Header/>
        {children}
        </div>
        
    </div>
    </Provider>
  )
}

export default layout