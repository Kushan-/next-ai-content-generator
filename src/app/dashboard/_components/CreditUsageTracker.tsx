import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useSelector, useDispatch } from 'react-redux';

//import { historyAction } from '../../../store';
//import { aiOutputSchema } from '../../api/pgOperation/schema'
// import { eq } from 'drizzle-orm'
// import { db } from '../../api/pgOperation/db'
import { useEffect, useState } from 'react'

interface ENTERIES {
    'aiResponse': string
}

interface STATE {
    history: {
        updateCreditUsage: boolean
    }
}

interface DATA {
    userEnteries:Array<string>
}

const CreditUsageTracker = (props: any) => {
    const dispatch = useDispatch()
    const { user } = useUser()
    const [totalUsage, setTotalUsage] = useState<number>(0)
    const remainingCredit = useSelector((state) => {
        return state.history.userCreditUsage
    })
    console.log("credit usage tracker->, ", remainingCredit)

    return (
        <div className='m-5'>
            {remainingCredit}
            {/* <div className='bg-primary text-white p-3 rounded-lg'>
                <h2 className='font-medium'>
                    Credits            </h2>
                <div className='h-2 bg-[#896ff9] w-full rounded-full mt-3'>
                    <div className='h2 bg-[#aaa1d0] rounded-full' style={{ width: (totalUsage / 10000) * 100 + '%' }}

                    >


                    </div>

                </div>
                <h2 className='text-snall my-2'>{totalUsage}/10000 Credits Used</h2>
            </div>
            <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button> */}
        </div>
    )
}
export default CreditUsageTracker