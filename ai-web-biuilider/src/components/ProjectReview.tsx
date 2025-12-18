
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react'
import { iframeScript } from '../assets/assets'
import type { Project } from '../types'
import EditorPanel from './EditorPanel'

interface ProjectPreviewProps {
  project: Project
  generating: boolean
  device?: 'phone' | 'tablet' | 'desktop'
  showEditorPanel: boolean
}

export interface ProjectPreviewRef {
  getCode: () => string | undefined
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(
  (
    { project, generating, device = 'desktop', showEditorPanel = true },
    ref
  ) => {
    const [selectedElement, setSelectedElement] = useState<any>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const resolutions = {
      phone: 'w-[412px]',
      tablet: 'w-[768px]',
      desktop: 'w-full',
    }



    /* expose api */
    useImperativeHandle(ref, () => ({
      getCode: () => {
        const doc = iframeRef.current?.contentDocument
        if(!doc) return undefined;

        //1.Remove our selection class / attributes / outline from all elements 
          doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((el)=>{
            el.classList.remove('ai-selected-element');
            el.removeAttribute('data-ai-selected');
            (el as HTMLElement).style.outline = ''
          })

          //2. Remove injected style from the document
          const previewStyle = doc.getElementById('ai-preview-style');
          if(previewStyle) previewStyle.remove();

          const previewScript = doc.getElementById('ai-preview-script');
          if(previewScript) previewScript.remove()

          //3.serializ clean HTML
          const html = doc.documentElement.outerHTML;
          return html;


      }
    }), [project.current_code])

    /* iframe → parent messages */
    useEffect(() => {
      const handleMessages = (e: MessageEvent) => {
        if (e.data?.type === 'ELEMENT_SELECTED') {
          setSelectedElement(e.data.payload)
        } else if (e.data?.type === 'CLEAR_SELECTION') {
          setSelectedElement(null)
        }
      }

      window.addEventListener('message', handleMessages)
      return () => window.removeEventListener('message', handleMessages)
    }, [])

    /* parent → iframe updates */
    const handleUpdate = (updates: any) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'UPDATE_ELEMENT',
          payload: updates,
        },
        '*'
      )
    }

    /* inject preview + script */
    const injectPreview = () => {
      const iframe = iframeRef.current
      if (!iframe) return

      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) return

      doc.open()
      doc.write(
        project.current_code?.includes('</body>')
          ? project.current_code.replace(
              '</body>',
              iframeScript + '</body>'
            )
          : project.current_code + iframeScript
      )
      doc.close()
    }

    useEffect(() => {
      if (project.current_code) injectPreview()
    }, [project.current_code])

    return (
      <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
        {project.current_code ? (
          <>
            <iframe
              title="project view"
              ref={iframeRef}
              className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
            />

            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null)
                  iframeRef.current?.contentWindow?.postMessage(
                    { type: 'CLEAR_SELECTION_REQUEST' },
                    '*'
                  )
                }}
              />
            )}
          </>
        ) : (
          generating && <div className="text-white p-4">loading</div>
        )}
      </div>
    )
  }
)

export default ProjectPreview
