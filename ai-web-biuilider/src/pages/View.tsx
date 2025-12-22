import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react';
import ProjectPreview from '../components/ProjectReview';
import type { Project } from '../types';
import api from '@/configs/axios';
import { toast } from 'sonner';

const View:React.FC = () => {

  const {projectId} = useParams();
  const [code,setCode] = useState('')
  const [loading,setLoading] = useState(true)
  
  const fetchCode = async()=>{
    try{
      const {data} = await api.get(`/api/project/published/${projectId}`)
      setCode(data.code)
      setLoading(false)
    }catch(err:any){
      toast.error(err?.response?.data.message || err.message)
      console.log(err)
    }
  }

  useEffect(()=>{
  fetchCode()
  },[])

  if(loading){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='size-7 animate-spin text-indigo-200'/>
      </div>
    )
  }


  return (
    <div className='h-screen'>
      {code && <ProjectPreview project={{current_code:code} as Project} generating={false} showEditorPanel={false}/>}
    </div>
  )
}

export default View