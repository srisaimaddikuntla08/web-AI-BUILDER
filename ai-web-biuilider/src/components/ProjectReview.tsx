import { forwardRef, useEffect, useRef } from 'react';
import { iframeScript } from '../assets/assets';
import type { Project } from '../types';



interface ProjectPreviewProps {
    project:Project
    generating :boolean
    device?:'phone' | 'tablet' | 'desktop'
    showEditorPanel : boolean
}

export interface ProjectPreviewRef{
        getCode :()=> string | undefined;
}


const ProjectReview = forwardRef<ProjectPreviewRef,ProjectPreviewProps>(({project,generating,device = 'desktop',showEditorPanel = true},ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const resolutions = {
        phone :'w-[412px]',
        tablet: 'w-[768px]',
        desktop :'w-full'
    }
    const injectPreview = () =>{
        const iframe = iframeRef.current;
        if(!iframe) return;
        const iframedoc = iframe.contentDocument || iframe.contentWindow?.document;
        if(iframedoc) iframedoc.body.innerHTML = project.current_code;
    }

    // const injectPreview = (html:string)=>{
    //     if(!html) return '';
    //     if(!showEditorPanel) return html;
    //     if(html.includes('</body>')){
    //         return html.replace('</body>',iframeScript + '</body>')
    //     }else{
    //         return html + iframeScript
    //     }
    // }

    useEffect(() => {
      injectPreview();
    },[project,iframeRef.current])

    
  return (
    <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
            {project.current_code ? (
                <>
                <iframe
                title='project view'
                 ref={iframeRef} 
                 className={`h-full max:sm:w-full ${resolutions[device]} mx-auto transition-all`}
                />
                </>
                ) : 
                (
                generating && (
                        <div>loading</div>
                    )
                )}
    </div>
  )
})

export default ProjectReview