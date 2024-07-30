"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useUser } from '@clerk/clerk-react'
import moment from 'moment'
import { useState } from "react";
import { useSelector } from "react-redux";
import { is } from "drizzle-orm";

import {STATEUSERSUBS} from '../../dashboard/_components/CreditUsageTracker'

const SubscribePage = () => {
  const isSubscribed = useSelector((state:STATEUSERSUBS) => {
    return state.userSubs.active
  })
  const [purchaseErr, setPuchaseErr] = useState("")
  const router = useRouter();
  const { user }: any = useUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress

  const handleOnClick = async () => {
    const payload = {
      createdBy: userEmail,
      createdAt: moment().format('yyyy/MM/DD'),
      plans: 'tier1',
      params: 'premiumUserInsertion',
    }


    const response = await fetch("/api/upgrade/", {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((res) => res.json()).then(data => {
      if (data.url) {
        router.push(data.url)
      } else {
        let errorText = ""
        console.log(data.err)
        if (data.err.raw) {
          errorText = `${data.err.raw.code} error status code ${data.err.statusCode}`
        }else{
          errorText = `${data.err} error status code ${data.err.statusCode}`
        }

        if (data.err.raw.message) {
          errorText = `${data.err.raw.message} error status code ${data.err.statusCode}`
        } else {
          errorText = `error status code ${data.err.statusCode}`
        }
        setPuchaseErr(errorText)
      }

    })
  }

  return (
    <div className="mx-5 py-2">
      <div className="mt-5 py-6 px-4 bg-white rounded">
        <h2 className="font-medium text-center">Upgrade Credit</h2>
      </div>
      <div className="mt-5 py-6 px-4 rounded">
        <Card className="w-[350px] flex flex-col mx-auto">
          <CardHeader>
            <CardTitle>$9.99/Month</CardTitle>
            <CardDescription>100000 AI Credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="flex my-2 gap-2">
                <Check></Check> 100,000 words
              </p>
              <p className="flex my-2 gap-2">
                <Check></Check> All Template Access
              </p>
              <p className="flex my-2 gap-2">
                <Check></Check> Retain All History
              </p>
            </div>
            <div className="flex flex-col space-y-5">
              {isSubscribed ? <Button className="mt-s bg-green-300">Subscribed Already</Button> :
                <Button className="mt-5" onClick={handleOnClick}>
                  Purchase
                </Button>
              }
              {
                purchaseErr ? <span className="bg-red-500 text-white">{purchaseErr}</span> : null
              }
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );


};

export default SubscribePage;