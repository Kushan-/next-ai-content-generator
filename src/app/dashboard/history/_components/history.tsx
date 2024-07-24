'use client'

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react'
import { auth, currentUser } from "@clerk/nextjs/server";


import { historyAction } from '../../../../store';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

interface PROPS {
    userEmailId: string
}

interface ENTERIES {
    'aiResponse': string
}

const UserContentHistory = ({ userEmailId }: PROPS) => {
    const [userHistory, setUserHistoryContent] = useState([])
    // const { user } = useUser()
    //getHistoryByuser(user)
    // console.log(result)
    // console.log("rendering history page")
    // console.log("UserContent History email ->", userEmailId);
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
                }).then((res) => res.json())
                    // console.log(data.body())
                    // const respData= data.json()
                    // console.log(respData)
                    // console.log(data.json())
                    // return data.json()
                    .then(data => {
                        console.log(data)
                        console.log(Object.keys(data).length)
                        if (Object.keys(data).length > 0) {
                            setUserHistoryContent(data)
                            // let historyContentArray = []
                            // for (let entry in data) {
                            //     console.log(data[entry])
                            //     historyContentArray.push(data[entry])
                            // }
                            // console.log(historyContentArray)
                        }

                        // let total = 0

                        // if (Object.keys(data.userEnteries).length > 0) {
                        //     // setUserHistoryContent([data.userEnteries])
                        //     for (let key in data.userEnteries) {
                        //         console.log(key)
                        //         console.log(data.userEnteries.key)
                        //     }
                        //     data.userEntries.forEach((enteries: ENTERIES, index: number) => {


                        //         if (enteries.aiResponse) {
                        //             console.log(enteries.aiResponse.length, 'at index->', index)
                        //             total = total + enteries.aiResponse.length
                        //         } else {
                        //             console.log(enteries)
                        //         }
                        //         console.log('final tally ->', total)

                        //     })
                        // }


                        // for(let entries in data){
                        //     console.log(entries)
                        //     console.log(entries.aiResponse.length)
                        //     total += entries.aiResponse.length

                        // }


                    }).catch((err: any) => {
                        console.log(err)
                    })

            }
            fetchData(userEmailId)

        }
    }, [userEmailId])
    return (

        <div>
            <div className="mt-5 py-6 px-4 bg-white rounded">
                <h2 className="font-medium text-center">Output History</h2>
            </div>
            <div className="mt-5 py-6 px-4 bg-white rounded">
                <Table>
                    <TableCaption>A list of your ai output history.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Template</TableHead>
                            <TableHead className="w-[250px]">Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Created At</TableHead>
                            <TableHead>Response length</TableHead>
                            <TableHead className="text-right">Copy to clipboard</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userHistory && userHistory.length > 0
                            ? userHistory.map((history) => (
                                <TableRow key={history.id}>
                                    <TableCell>{history.templateSlug}</TableCell>
                                    <TableCell className="w-[250px]">{history.formData}</TableCell>
                                    <TableCell className="whitespace-pre-wrap">
                                        {history.aiResponse}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {history.createdAt}
                                    </TableCell>
                                    <TableCell>
                                        {history.aiResponse.length}
                                    </TableCell>
                                    <TableCell>
                                    <Button onClick={()=>navigator.clipboard.writeText(history.aiResponse)} variant="link">Copy!</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}



export default UserContentHistory