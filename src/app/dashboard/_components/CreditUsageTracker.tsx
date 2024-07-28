"use client"
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router'
import { useUser } from '@clerk/clerk-react'
import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'next/router';


import { Button } from '@/components/ui/button'
import UsageChart from './UsageChart'


export interface STATEUSERSUBS {
    userSubs: {
        active: boolean,
        date: string,
        plan:string,


    }
}


export interface STATEHISTORY {
    history: {

        userCreditUsage:number
    }
}

interface DATA {
    userEnteries:Array<string>
}

const CreditUsageTracker = (props: any) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { user } = useUser()

    const isSubscribed = useSelector((state : STATEUSERSUBS) => {
        return state.userSubs.active
    })
    const renewalDate = useSelector((state : STATEUSERSUBS)=>{
        return state.userSubs.date
    })
    const remainingCredit = useSelector((state: STATEHISTORY) => {
        return state.history.userCreditUsage
    })

    
    console.log("credit usage tracker->, ", remainingCredit)

    return (
        <div className='m-5'>
            <h3 className="text-center">
                Credit Usage
            </h3>
            <div className='text-center text-black rounded-lg text-pretty text-bol'>
            {remainingCredit}
            </div>
            {
                isSubscribed?<Button className="text-green-200 text-pretty p-2">Renewal date a month {renewalDate} after</Button>:
                <Button variant={'secondary'} className='w-full my-3 text-primary'  onClick={() => router.push('/dashboard/subscribe')}>Upgrade</Button>
            }
            {/* <UsageChart/> */}
            
           
        </div>
    )
}
export default CreditUsageTracker