'use client'

import React, { useState } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

const DashboardPage = () => {

  const [userSearchInput, setUserSearchInput] = useState<string>()

  return (
      <div>
        <SearchSection handleSearchChange={(event: any)=>setUserSearchInput(event.target.value)}/>
        <TemplateListSection searchInputResult={userSearchInput}/>
      </div>
        
      
  )
}

export default DashboardPage