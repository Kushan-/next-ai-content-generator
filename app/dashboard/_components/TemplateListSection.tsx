import React, { useEffect , useState} from 'react'
import templateData from '../../(data)/Templates'
import TemplateCard from './TemplateCard'
import { StaticImageData } from 'next/image'
import { UserSearch } from 'lucide-react'

export interface TEMPLATE{
    name:string,
    desc:string,
    icon:string | StaticImageData,
    category:string,
    slug:string,
    aiPrompt:string,
    form?:FORM[]

}

interface FORM{
    label:string,
    field:string,
    name:string,
    required?:boolean,
    
}

const TemplateListSection = ({searchInputResult}:any) => {

  const [templatList, setTemplateList] = useState(templateData)
  useEffect(()=>{
    if(searchInputResult){
      const filteredTemplateResult = templateData.filter( item => item.name.toLowerCase().includes(searchInputResult.toLowerCase()))
      console.log(searchInputResult)
      setTemplateList(filteredTemplateResult)
    }else{
      setTemplateList(templateData)
    }
    
  },[searchInputResult])

  return (
    <div className='grid grids-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10'>
        
        {templatList.map( (item:TEMPLATE, index:number) => (
            <TemplateCard key={index} {...item}/>
            
            
            
        ))}
    </div>
  )
}

export default TemplateListSection