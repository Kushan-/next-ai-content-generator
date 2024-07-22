'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { historyAction, aiResponseAction} from '../../../../store';

import { useUser } from '@clerk/clerk-react'
import moment from 'moment'


import InputFormSection from './InputFormSection'
import OutputFormSection from './OutputFormSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import templateData from '../../../(data)/Templates'
import { chatSession } from '../../../../../utils/aiModel'



interface PROPS {
  'templateSlug': string
}

const FormSection = ({ templateSlug }: PROPS) => {
  
  const selectedTemplate: TEMPLATE | undefined = templateData?.find(item => item.slug === templateSlug)
  
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5 py-5'>
      <InputFormSection selectedTemplate={selectedTemplate}
        templateSlug={templateSlug}
      />

      <OutputFormSection />

    </div>

  )
}

export default FormSection
