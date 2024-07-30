'use client'

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import { Copy } from 'lucide-react';

interface PROPS {
  aiResponseOutput:string|undefined
}

interface STATE {
  aiResponse:{
    aiResponseContent:String
  }
}

const OutputFormSection = () => {
  const editorRef:any = useRef()
  
  const aiResponseOutput = useSelector((state:STATE) => state.aiResponse.aiResponseContent)

  useEffect(()=>{
    const editorInstance=editorRef.current.getInstance();
    editorInstance.setMarkdown(aiResponseOutput)
  },[aiResponseOutput])

  return(

    <div className='bg-white shadow-lg border rounded-lg'>
    <div className='flex justify-between items-center p-5'>
      <h2 className='font-medium text-lg'> Your Result</h2>
      <Button className='flex gap-2'><Copy className='w-4 h-4'/>Copy</Button>
    </div>

    <Editor
      ref={editorRef}
      initialValue="Appearing  Result...."
      // previewStyle="vertical"
      initialEditType='wysiwyg'
      height="600px"
      useCommandShortcut={true}
      onChange={()=>console.log(editorRef.current.getInstance().getMarkdown())
        
      }
    />
  </div>

  )
  
}
export default OutputFormSection