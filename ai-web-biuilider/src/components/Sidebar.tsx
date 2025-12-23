import api from '@/configs/axios'
import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import type { Message, Project, Version } from '../types'

interface SidebarProps {
    isMenuOpen: boolean,
    project: Project,
    setProject: (project: Project) => void,
    generating: boolean,
    setGenerating: (IsGenerating: boolean) => void
}

const Sidebar = ({ isMenuOpen, project, setProject, generating, setGenerating }: SidebarProps) => {

    const messageRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState('')
    const fecthProjects = async () => {
        try {
            const { data } = await api.get(`/api/user/project/${project.id}`)
            setProject(data.project)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)

        }
    }

    const handleRollBack = async (versionId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to rollback to this version')
            if (!confirm) return;
            setGenerating(true)
            const { data } = await api.get(`/api/projects/rollback/${project.id}/${versionId}`)
            const { data: data2 } = await api.get(`/api/user/project/${project.id}`)
            toast.success(data.message)
            setProject(data2.project)
            setGenerating(false)

        } catch (error: any) {
            setGenerating(false)
            toast.error(error?.response?.data.message || error.message)
            console.log(error)

        }
    }

    const handleRevisions = async (e: React.FormEvent) => {
        e.preventDefault();
        let interval: number | undefined
        try {
            setGenerating(true)
            interval = setInterval(() => {
                fecthProjects();
            }, 1000)
            const { data } = await api.post(`/api/project/revision/${project.id}`, { message: input })
            fecthProjects()
            toast.success(data.message)
            setInput('')
            clearInterval(interval)
        } catch (error: any) {
            setGenerating(false)
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
            clearInterval(interval)
        }
    }


    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [project.conversation.length, setGenerating])
    return (
        <div className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
            <div className='flex flex-col h-full '>

                <div className='flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4'>
                    {[...project.conversation, ...project.versions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message) => {
                        const isMessage = 'content' in message;
                        if (isMessage) {
                            const msg = message as Message;
                            const isUser = msg.role === 'user';
                            return (
                                <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : "justify-start"}`} key={msg.id} >
                                    {!isUser && (
                                        <div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center'>
                                            <BotIcon size={6} className='text-white' />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm mt-5 leading-relaxed ${isUser ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none" : " rounded-tl-none bg-gray-800 text-gray-100"}`}>
                                        {msg.content}
                                        {isUser && (
                                            <div>
                                                <UserIcon size={6} className='text-gray-200' />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        } else {
                            const ver = message as Version;
                            return (
                                <div key={ver.id} className='w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2 '>
                                    <div>
                                        code updated <br />
                                        <span className='text-gray-500 text-xs font-normal'>
                                            {new Date(ver.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        {project.current_version_index === ver.id ?
                                            (<button className='px-3 py-1 rounded-md text-xs bg-gray-700'>Curret Version</button>) : <button className='px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white' onClick={() => handleRollBack(ver.id)}>Roll back to this version</button>}
                                        <Link target='_blank' to={`/preview/${project.id}/${ver.id}`}><EyeIcon className='size-6 p-1 bg-gray-700 hover:bg-indigo-500 transition-colors rounded' /></Link>


                                    </div>
                                </div>
                            )
                        }
                    })}
                    {generating && (
                        <div className='flex items-start gap-3 justify-start'>
                            <div className='w-8 h-8 rounded-full bg-linear-to from-indigo-600 to-indigo-700 items-center justify-center'>
                                <BotIcon size={5} className='text-white' />
                            </div>
                            <div className='flex gap-1.5 h-full items-end'>
                                <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0s' }} />
                                <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0.1s' }} />
                                <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0.2s' }} />

                            </div>
                        </div>
                    )}
                    <div ref={messageRef}></div>
                </div>

                <form onSubmit={handleRevisions} className='m-3 relative'>
                    <div className='flex items-center gap-2 '>
                        <textarea rows={4} placeholder='prompt for website Generation' className='flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-600 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all' disabled={generating} value={input} onChange={(e) => setInput(e.target.value)} />
                        <button>{generating || input.trim() ? <Loader2Icon size={6} className='p-1.5 animate-spin text-white' /> : <SendIcon size={6} className='p-1.5 text-white' />}
                            {/* <button disabled={generating || !input.trim()}> */}
                            {generating ? (
                                <Loader2Icon size={16} className="animate-spin text-white" />
                            ) : (
                                <SendIcon size={16} className="text-white" />
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Sidebar
