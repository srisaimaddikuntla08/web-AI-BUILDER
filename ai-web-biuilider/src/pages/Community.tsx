import React, { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer'
import api from '@/configs/axios'
import { toast } from 'sonner'



const Community:React.FC = () => {


    const [loading, setLoading] = useState<boolean>(true)
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
     const {data} = await api.get('/api/project/publish')
     setProjects(data.projects)
     setLoading(false)
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message)
      console.error('Failed to fetch projects', error)

    } 
  }





  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2Icon className="size-6 animate-spin text-indigo-200" />
      </div>
    )
  }


  return (
    <>
        <div className="px-4 md:px-16 lg:px-24 xl:px-32 min-h-[80vh]">
      {projects.length > 0 ? (
        <div className="py-10">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-medium text-white">Published Projects</h1>
          </div>
          {/* Project list goes here */}
          <div className='flex flex-wrap gap-3.5'>
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/view/${project.id}`}
                className=" w-72 max-sm:mx-auto cursor-pointer
             bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden
               hover:border-indigo-800/80
             transition-all duration-300"
              >
                <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                  {project.current_code ? (
                    <iframe
                      loading="lazy"
                      srcDoc={project.current_code}
                      sandbox="allow-scripts"
                      className="absolute top-0 left-0 w-[1200px] h-[800px]
                   origin-top-left pointer-events-none"
                      style={{ transform: 'scale(0.25)' }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No Preview</p>
                    </div>
                  )}
                </div>
                  {/* content of projects */}
                  <div className='p-4 text-white bg-linear-180 from-trasparent group-hover:from-indig-950 to-transparent transition-colors'>
                      <div className='flex items-start justify-between'>
                          <h2 className='text-lg font-medium line-clamp-2'>{project.name}</h2>
                          <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full'>Website</button>
                      </div>
                      <p className='text-gray-400 mt-1 text-sm line-clamp-2'>{project.initial_prompt}</p>
                      
                      <div className='flex justify-between items-center mt-6'>
                      <span className='text-xs text-gray-500'>
                        {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <div className='flex gap-3 text-white'>
                          <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md  transition-colors flex items-center gap-2'>
                            <span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center'>{project.user?.name?.slice(0,1)}</span>
                            {project.user?.name}
                          </button>
                          </div>
                      </div>
                  </div>
              </Link>

            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <h1 className="text-3xl font-semibold text-gray-300 mb-6">
            Oops! There are no projects created yet.
          </h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer text-white px-3 sm:px-6 py-2 rounded bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all"
          >
            <PlusIcon size={18} /> Create New
          </button>
        </div>
      )}
    </div>
    <Footer/>
    </>
  )
}

export default Community