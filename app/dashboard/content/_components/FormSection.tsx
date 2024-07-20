'use client'
import { useState } from 'react'

import InputFormSection from './InputFormSection'
import OutputFormSection from './OutputFormSection'

import { TEMPLATE } from '../../_components/TemplateListSection'
import templateData from '../../../(data)/Templates'
import { chatSession } from '../../../../utils/aiModel'

import { useUser } from '@clerk/clerk-react'
import moment from 'moment'

interface PROPS {
  'templateSlug': string
}

const FormSection = ({ templateSlug }: PROPS) => {
  const selectedTemplate: TEMPLATE | undefined = templateData?.find(item => item.slug === templateSlug)
  const [loadingAiResponse, setLoadingAiResponse] = useState(false)
  const [aiContentResponse, setAiContentResponse] = useState<string>()
  const { user }: any = useUser()

  const generateAiContent = async (formData: any) => {
    setLoadingAiResponse(true)
    const selectedPrompt = selectedTemplate?.aiPrompt;
    const finalAiPrompt = `${JSON.stringify(formData)},${selectedPrompt}`
    const chatSessionResult = await chatSession.sendMessage(finalAiPrompt)
    const chatSessionResponse = chatSessionResult.response.text()
    setAiContentResponse(chatSessionResponse)
    const userEmail = user?.primaryEmailAddress?.emailAddress
    const aiContentPayload = {
      finalAiPrompt,
      formData,
      templateSlug,
      aiResponse: chatSessionResponse,
      chatResponseLength: chatSessionResponse.length,
      createdBy: userEmail,
      createdAt: moment().format('yyyy/MM/DD')
    }
    console.log(aiContentPayload)
    const response = await fetch('/api/postGresOperation', {
      method: 'POST',
      body: JSON.stringify(aiContentPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.status)
    if (response.status === 200) {
      setLoadingAiResponse(false)
      console.log(response)
    } else {
      setLoadingAiResponse(true)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5 py-5'>
      <InputFormSection selectedTemplate={selectedTemplate} useFormInput={generateAiContent} aiResponseLoading={loadingAiResponse} />
      
      <OutputFormSection aiResponseOutput={aiContentResponse} />

    </div>

  )
}

export default FormSection
