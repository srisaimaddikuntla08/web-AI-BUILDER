import { Loader2Icon } from 'lucide-react'
import React, { useEffect } from 'react'

const loading:React.FC = () => {

    useEffect(()=>{
        setTimeout(()=>{
            window.location.href = '/'
        },3000)
    },[])



  return (
    <div className='h-screen flex flex-col'>
        <div className='flex items-center justify-center flex-1 gap-4'>
            <Loader2Icon  className=' size-7 animate-spin text-indigo-600'/>
            <h1>wait a minutee..</h1>
        </div>
    </div>
  )
}

export default loading