'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'
import { historyAction } from '../../store';
import { useUser } from "@clerk/clerk-react"

const DashboardPage = () => {
  const { user } = useUser()
  const userId = user?.id
  const userEmailId = user?.primaryEmailAddress?.emailAddress
  //console.log('->>>>', userId, userEmailId)
  const dispatch = useDispatch()
  const [userSearchInput, setUserSearchInput] = useState<string>()

  useEffect(() => {
    // console.log('->>>>', userId, userEmailId)
    if (userId) {
      const payload = {
        params: 'newUser',
        userId
      }
      fetch('/api/pgOperation', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => res.json()).then(data => {
        console.log(data)
        if (!data.err) {
          dispatch(historyAction.updateCreditUsage({ totalRemainingCredits: data.totalRemainingCredits, params: "initiate" }))
        }
      })
    }


  }, [userId])
  return (
    <div>
      <SearchSection handleSearchChange={(event: any) => setUserSearchInput(event.target.value)} />
      <TemplateListSection searchInputResult={userSearchInput} />
    </div>


  )


}


export default DashboardPage