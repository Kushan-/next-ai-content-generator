import React from 'react'

import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputFormSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import templateData from '../../../(data)/Templates'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'



const SlugPage = ({ params }: any) => {
  console.log(params.templateSlug)
  const selectedTemplate: TEMPLATE | undefined = templateData?.find(item => item.slug === params.templateSlug)
  const templateSlug = params.templateSlug
  return (
    <div className='p-5'>
      <h5>{params.templateSlug}</h5>
      <Link href={`/dashboard`}>
        <Button><ArrowLeft />Back</Button>
      </Link>
      <FormSection templateSlug={templateSlug} />
    </div>
  )
}

export default SlugPage