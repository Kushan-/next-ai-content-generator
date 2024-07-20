import React from 'react'
import { Search } from 'lucide-react'
const SearchSection = ({handleSearchChange}:any) => {

    return (
        <div className='flex justify-center flex-col items-center text-white p-10 bg-gradient-to-br from-purple-500 via-purple-700 to-blue-600'>
            <h2 className='text-3xl font-bold'>
                Browse all the Template
            </h2>
            <p>
                what would you like to create today</p>
            <div className='w-full  flex justify-center text-center'>

            </div>
            <div className='w-full flex justify-center items-center'>
                <div className='w-30% flex gap-2 items-center p-2 border rounded-md bg-white justify-center my-5' >
                    <Search className='text-primary'/>
                    <input type="text" placeholder="search"
                        className='bg-transparent w-full outline-none text-black' onChange={handleSearchChange}/>


                </div>
            </div>
        </div>
    )
}

export default SearchSection