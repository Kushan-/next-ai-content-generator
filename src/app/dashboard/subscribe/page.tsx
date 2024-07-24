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

const SubscribePage = () => {

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


    const response = await fetch("/api/upgrade/checkout", {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // push user to the stripe url
  // router.push(response.data.url);

  return (
    <div className="mx-5 py-2">
      <div className="mt-5 py-6 px-4 bg-white rounded">
        <h2 className="font-medium text-center">Upgrade Credit</h2>
      </div>
      <div className="mt-5 py-6 px-4 rounded">
        <Card className="w-[350px] flex flex-col mx-auto">
          <CardHeader>
            <CardTitle>$9.99/Moth</CardTitle>
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
            <Button className="mt-5" onClick={handleOnClick}>
              Purchase
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );


};

export default SubscribePage;