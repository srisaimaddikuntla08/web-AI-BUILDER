import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Project } from '../types';
import { DownloadIcon, EyeIcon, EyeOffIcon, Fullscreen, Laptop2Icon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react';
import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets';
import Sidebar from '../components/Sidebar';
import ProjectReview, { type ProjectPreviewRef } from '../components/projectReview';


const Projects: React.FC = () => {
  const { projectId } = useParams();

  console.log(projectId)

  const navigate = useNavigate();


  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(true);
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  

  const previewRef = useRef<ProjectPreviewRef>(null)

  const fecthProjects = () => {
    const projectRes =  dummyProjects.find((project) => project.id === projectId);

    setTimeout(() => {
      if (projectRes) {
        setProject({...projectRes,conversation:dummyConversations,versions:dummyVersion});
        setLoading(false)
        setGenerating(projectRes?.current_code ? false : true);
        // setGenerating
      }
    }, 1000)
  }

  const togglePublish = async()=>{

  }
  
  const saveProject = async()=>{

  }

  const downloadCode = async()=>{

  }


  useEffect(() => {
    fecthProjects();
  }, [])





  //loading state
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <Loader2Icon className='size-7 text-violet-200 animate-spin' />
        </div>
      </>
    )
  }

  return project ? (
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
        <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
          <img src='/favicon.svg' alt="logo" className='h-6 cursor-pointer' onClick={() => navigate('/')} />
          <div className='max-w-64 sm:max-w-xs'>
            <p className='text-sm text-medium capitalize truncate'>{project.name}</p>
            <p className='text-xs text-gray-400 -mt-0.5'>Previwe last saved version</p>
            <div className='sm:hidden flex-1 flex justify-end'>
              {isMenuOpen ? <MessageSquareIcon className='size-6 cursor-pointer' onClick={()=>setIsMenuOpen(false)} /> : <XIcon className='size-6 cursor-pointer' onClick={()=>setIsMenuOpen(true)} />}
            </div>
          </div>
        </div>


        <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
            <SmartphoneIcon onClick={()=>setDevice("phone")} className={`size-6 p-1 rounded-full cursor-pointer ${device === 'phone' ? "bg-gray-700" : ''}`} />
            <TabletIcon onClick={()=>setDevice("tablet")} className={`size-6 p-1 rounded-full cursor-pointer ${device === 'tablet' ? "bg-gray-700" : ''}`} />
            <Laptop2Icon onClick={()=>setDevice("desktop")} className={`size-6 p-1 rounded-full cursor-pointer ${device === 'desktop' ? "bg-gray-700" : ''}`} />

        </div>


        <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm'>
          <button className='max-sm:hidden bg-gray-800 hover:bg-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-t-gray-700' disabled={isSaving} onClick={saveProject}>
            {isSaving ? <Loader2Icon className='animate-spin size-6'/> : <SaveIcon size={16}/> } save 
          </button>

          <Link className='flex items-center gap-2 px-4 py-1 rounded-sm border border-gray-800 hover:border-gray-600 transition-colors' target='_blank' to={`/preview/${projectId}`}>
          <Fullscreen/>
           Preview
          </Link>
          
          <button className='bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors' onClick={downloadCode}>
           <DownloadIcon size={16}/>
            Download
          </button>

          <button onClick={togglePublish} className='bg-blue-500 rounded sm:rounded-sm text-white flex items-center gap-1 transition-all p-3' >
            {project.isPublished ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
            {project.isPublished ? "Unpublish" : "Publish" }
          </button>
        </div>
      </div>

      <div className='flex-1 flex overflow-auto'> 
        <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p)=>setProject(p)} setGenerating={setGenerating} generating={generating}/>
        <div className='flex-1 p-2 pl-0'>
          <ProjectReview ref={previewRef} project={project} generating={generating} device={device}/>
        </div>
      </div>

    </div>
  ) :
    (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-2xl font-medium text-gray-200'>Unable to load projects</p>
      </div>
    )
}

export default Projects