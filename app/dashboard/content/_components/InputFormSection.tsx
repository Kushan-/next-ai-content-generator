'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2Icon } from 'lucide-react'

import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'
import templateData from '../../../(data)/Templates'


interface PROPS{
  selectedTemplate?:TEMPLATE,
  useFormInput:any,
  aiResponseLoading:boolean
}

const InputFormSection = ( {selectedTemplate, useFormInput, aiResponseLoading}:PROPS ) => {

  const [formData, setFormData] = useState<any>();

  const onSubmit = (e:any) =>{
    e.preventDefault()
    useFormInput(formData)
  }
  const handleChange = (e:any) =>{
    //onsole.log(e.target.value)
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]:value,
     // name:value,

    })

  }

  return (

    
    <div className='p-5 shadow-md border rounded-lg bg-white'>
      

      <Image src={selectedTemplate?.icon}
      alt='icon'
      width={70}
      height={70}/>
      <p className='text-grey-500 text-sm'>{selectedTemplate?.desc}</p>

      <form  onSubmit={onSubmit} className='mt-6'>
        {selectedTemplate?.form?.map((item, index)=>(
          <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
            <label>{item.label}</label>
            {item.field==='input'?
            <Input name={item.name} required={item?.required} onChange={handleChange}/> : item.field === 'textarea'? <Textarea/>: null}
          </div>
        ))}
        <Button type='submit' 
        disabled={aiResponseLoading}
        className='w-full py-6'>{aiResponseLoading&&<Loader2Icon className='animate-spin'/>}generate Content</Button>
      </form>

      
    </div>
  )
}

export default InputFormSection