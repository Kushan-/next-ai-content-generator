import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'

import { aiOutputSchema } from '../../api/pgOperation/schema'
import {eq} from 'drizzle-orm'

const CreditUsageTracker = () => {

    const {user} = useUser()
    console.log(user?.primaryEmailAddress?.emailAddress)
    // const getData=()=>{
    //     const result= await db.select().from(aiOutputSchema).where(eq(aiOutputSchema.createdBy,user?.primaryEmailAddress.emailAddress))
    // const getTotalUsage = () =>{
    //     let total:number = 0
    //     result.forEach(ele=>{
    //         total+=Number(ele.aiContentResponse?.length)
    //     })
    // }

    // }
    
    return (
        <div className='m-5'>
            <div className='bg-primary text-white p-3 rounded-lg'>
                <h2 className='font-medium'>
                    Credits            </h2>
                <div className='h-2 bg-[#896ff9] w-full rounded-full mt-3'>
                    <div className='h2 bg-[#aaa1d0] rounded-full' style={{width:'35%'}}
                     
                    >


                    </div>

                </div>
                <h2 className='text-snall my-2'>350/10000 Credits Used</h2>
            </div>
            <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
        </div>
    )
}

export default CreditUsageTracker