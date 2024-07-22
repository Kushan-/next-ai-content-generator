'use client'

import { useDispatch } from 'react-redux';
import { historyAction } from '../../../../store';
import { useEffect, useState } from 'react'


interface PROPS {
    userEmailId: string
}

interface ENTERIES {
    'aiResponse':string
}

const UserContentHistory = ({ userEmailId }: PROPS) => {
    // const { user } = useUser()
    //getHistoryByuser(user)
    // console.log(result)
    console.log("rendering history page")
    console.log("UserContent History email ->", userEmailId);
    useEffect(() => {
        if (userEmailId) {
            const fetchData = async (userEmailId: string) => {
                const payload = {
                    email: userEmailId,
                    params: 'userHistoryContent'
                }
                const response = await fetch('/api/pgOperation', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(data => {
                    return data.json()
                }).then(data => {
                    console.log(data.userEntries.length)

                    let total = 0
                    
                    
                    data.userEntries.forEach((enteries:ENTERIES, index:number) => {


                        if (enteries.aiResponse) {
                            console.log(enteries.aiResponse.length, 'at index->', index)
                            total = total + enteries.aiResponse.length
                        } else {
                            console.log(enteries)
                        }
                        console.log('final tally ->', total)

                    })
                    
                    // for(let entries in data){
                    //     console.log(entries)
                    //     console.log(entries.aiResponse.length)
                    //     total += entries.aiResponse.length

                    // }


                }).catch((err:any)=>{
                    console.log(err)
                })

            }

            fetchData(userEmailId)

        }
    }, [userEmailId])
    return (

        <div>history</div>
    )
}



export default UserContentHistory