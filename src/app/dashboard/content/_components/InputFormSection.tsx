'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2Icon } from 'lucide-react'

import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'

import { useDispatch, useSelector } from 'react-redux';
import { historyAction } from '../../../../store';
import { aiResponseAction } from '../../../../store'

import { useUser } from '@clerk/clerk-react'
import moment from 'moment'

import { chatSession } from '../../../../../utils/aiModel'




interface PROPS {
  selectedTemplate?: TEMPLATE,
  templateSlug: string,

}

const InputFormSection = ({ selectedTemplate, templateSlug }: PROPS) => {
  const dispatch = useDispatch()
  const remainingCredits: number = useSelector((state) => state.history.userCreditUsage)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<any>();
  
  const [loadingAiResponse, setLoadingAiResponse] = useState(false)
  // const [aiContentResponse, setAiContentResponse] = useState<string>()
  const { user }: any = useUser()

  const userEmail = user?.primaryEmailAddress?.emailAddress


  const onSubmit = (e: any) => {
    e.preventDefault()
    console.log(formData)
    console.log("==========================",remainingCredits)
    // const dispatch = useDispatch()
    

    const generateAiContent = async (formData: any) => {


      setLoadingAiResponse(true)
      const selectedPrompt = selectedTemplate?.aiPrompt;
      const finalAiPrompt = `${JSON.stringify(formData)},${selectedPrompt}`
      const chatSessionResult = await chatSession.sendMessage(finalAiPrompt)
      const chatSessionResponse = chatSessionResult.response.text()

      if ((remainingCredits - chatSessionResponse.length) > 0) {

        dispatch(aiResponseAction.updateAiResponse(chatSessionResponse))

        // setAiContentResponse(chatSessionResponse)
        // dispatch(historyAction.upadateCreaditUsage(true))
        console.log(formData)


        const aiContentPayload = {
          finalAiPrompt,
          formData,
          templateSlug,
          aiResponse: chatSessionResponse,
          chatResponseLength: chatSessionResponse.length,
          createdBy: userEmail,
          createdAt: moment().format('yyyy/MM/DD'),
          params: 'dbInertion',
          responseLength: chatSessionResponse.length
        }
        console.log(aiContentPayload)

        const response = await fetch('/api/pgOperation', {
          method: 'PUT',
          body: JSON.stringify(aiContentPayload),
          headers: {
            'Content-Type': 'application/json'
          },

        });
        console.log(response.status)
        if (response.status === 200) {
          setLoadingAiResponse(false)
          const storeAction = {
            params: 'update',
            responseLength: chatSessionResponse.length
          }
  
          dispatch(historyAction.updateCreditUsage(storeAction))
          

          // update premium user db with remaining credits
          const userCreditPayload = {
            params:"updateUserCredits",
            totalUserCreditLeft:remainingCredits-chatSessionResponse.length
          }

          await fetch('/api/pgOperation', {
            method: 'POST',
            body: JSON.stringify(userCreditPayload),
            headers: {
              'Content-Type': 'application/json'
            },
  
          }).then( (res)=>res.json).then((data)=>console.log(data))
          
          console.log(response)
        } else {
          setLoadingAiResponse(true)
          setError("Something went wrong , please try again")
        }
        // console.log("=========set Dispatch to FALSE===========")
        //dispatch(historyAction.upadateCreaditUsage(false))

      } else {
        console.log(chatSessionResponse.length, remainingCredits)
        setError(`your available credits are insufficient to cover the length of the response, Please upgrade`)

      }
    }
    generateAiContent(formData)

  }
  const handleChange = (e: any) => {
    //onsole.log(e.target.value)
    const { name, value } = e.target
    // console.log(formData)
    setFormData({
      ...formData,
      [name]: value,
      // name:value,

    })

  }

  return (


    <div className='p-5 shadow-md border rounded-lg bg-white'>


      <Image src={selectedTemplate?.icon}
        alt='icon'
        width={70}
        height={70} />
      <p className='text-grey-500 text-sm'>{selectedTemplate?.desc}</p>

      <form onSubmit={onSubmit} className='mt-6'>
        {selectedTemplate?.form?.map((item, index) => (
          <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
            <label>{item.label}</label>
            {item.field === 'input' ?
              <Input name={item.name} required={item?.required} onChange={handleChange} /> : item.field === 'textarea' ? <Textarea /> : null}
          </div>
        ))}
        {
          error===""?  <Button type='submit'
          disabled={loadingAiResponse}
          className='w-full py-6'>{loadingAiResponse && <Loader2Icon className='animate-spin' />}generate Content</Button> : 
          <Button variant="destructive">{error}</Button> 
        }
        
      </form>


    </div>
  )
}

export default InputFormSection