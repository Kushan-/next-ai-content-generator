'use client'

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react'
import { auth, currentUser } from "@clerk/nextjs/server";
import { useUser } from '@clerk/clerk-react';


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

interface HISTORYSTATE {
    id: string,
    templateSlug:string,
    formData:string,
    aiResponse:string,
    createdAt:string

}

interface ENTERIES {
    'aiResponse': string
}

const UserContentHistory = () => {
    const [userHistory, setUserHistoryContent] = useState([])
    // const { user } = useUser()
    //getHistoryByuser(user)
    // console.log(result)
    // console.log("rendering history page")
    // console.log("UserContent History email ->", userEmailId);
    
    const { user } = useUser()
    const userId = user?.id
    const userEmailId = user?.primaryEmailAddress?.emailAddress
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
                    .then(data => {
                        console.log(data)
                        console.log(Object.keys(data).length)
                        if (Object.keys(data).length > 0) {
                            setUserHistoryContent(data)
                        }

                    }).catch((err: any) => {
                        console.log(err)
                    })

            }
            fetchData(userEmailId)

        }
    }, [])
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
                            ? userHistory.map((history:HISTORYSTATE) => (
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