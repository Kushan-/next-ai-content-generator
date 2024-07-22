import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useSelector, useDispatch } from 'react-redux';

import { historyAction } from '../../../store';
import { aiOutputSchema } from '../../api/pgOperation/schema'
import { eq } from 'drizzle-orm'
import { db } from '../../api/pgOperation/db'
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
    const updateCreditUsage = useSelector((state: STATE) => state.history.updateCreditUsage)
    console.log("updateCreditUsage->", updateCreditUsage)
    const userEmail = user?.primaryEmailAddress?.emailAddress
    console.log("----->> ALSWAYS", totalUsage)
    if (totalUsage > 0) {
        dispatch(historyAction.upadateCreaditUsage(false))
        console.log("=========set Dispatch to FALSE===========")
    }

    console.log('userEmail--->>>', userEmail)

    const calculateTotalUsage = (data:DATA) => {
        console.log(data)
        console.log(data.userEnteries)

        let total = 0


        data.userEnteries.forEach((entery: ENTERIES, index: number) => {


            if (entery.aiResponse) {
                console.log(entery.aiResponse.length, 'at index->', index)
                total = total + entery.aiResponse.length
            } else {
                console.log(entery)
            }
            console.log('final tally ->', total)

        })
        setTotalUsage(total)
    }

    useEffect(() => {
        if (userEmail || updateCreditUsage) {
            localStorage.setItem('userEmail', userEmail)
            let email: string | null = localStorage.getItem('user-email')
            // console.log("localStorage->>", email)
            if (!email) {
                email = userEmail
            }
            console.log("email->", email, "userEmail", userEmail)
            const fetchData = async (userEmail: string) => {
                const payload = {
                    email: userEmail,
                    params: 'creditUsageTracker'
                }
                const response = await fetch('/api/pgOperation', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                response.json().then(data => {
                    calculateTotalUsage(data)
                })
            }

            fetchData(userEmail)
        }

    }, [userEmail, updateCreditUsage])


    return (
        <div className='m-5'>
            <div className='bg-primary text-white p-3 rounded-lg'>
                <h2 className='font-medium'>
                    Credits            </h2>
                <div className='h-2 bg-[#896ff9] w-full rounded-full mt-3'>
                    <div className='h2 bg-[#aaa1d0] rounded-full' style={{ width: (totalUsage / 10000) * 100 + '%' }}

                    >


                    </div>

                </div>
                <h2 className='text-snall my-2'>{totalUsage}/10000 Credits Used</h2>
            </div>
            <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
        </div>
    )
}
export default CreditUsageTracker


// export const getStaticProps = async (context: any) => {
//     const { user } = useUser()
//     const emailAddress = user?.primaryEmailAddress?.emailAddress
//     console.log("========context==========")
//     console.log(context)
//     console.log(emailAddress)
//     console.log("========context==========")

//     console.log()
//     const result = await db.select().from(aiOutputSchema).where(eq(aiOutputSchema.createdBy, user?.primaryEmailAddress.emailAddress))
//     console.log(result)
//     let total = 0
//     result.forEach(ele => {
//         total += ele.aiResponse?.length
//     })
//     console.log(total)
//     return {
//         props: {
//             credits: total
//         }
//     }
// }