



import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface EditorPanelProps {
  selectedElement: {
    tagName: string
    className: string
    text: string
    styles: {
      padding: string
      margin: string
      backgroundColor: string
      color: string
      fontSize: string
    }
  } | null

  onUpdate: (updates: any) => void
  onClose: () => void
}

const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {
  const [values, setValues] = useState(selectedElement)

  useEffect(() => {
    setValues(selectedElement)
  }, [selectedElement])

  if (!values) return null

  /* text + classname */
  const handleFieldChange = (field: 'text' | 'className', value: string) => {
    const updated = { ...values, [field]: value }
    setValues(updated)
    onUpdate({ [field]: value })
  }

  /* styles */
  const handleStyleChange = (
    style: keyof typeof values.styles,
    value: string
  ) => {
    const updatedStyles = { ...values.styles, [style]: value }
    setValues({ ...values, styles: updatedStyles })
    onUpdate({ styles: { [style]: value } })
  }

  return (
    <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-xl border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Edit Element</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4 text-black">
        {/* TEXT */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Text</label>
          <textarea
            value={values.text}
            onChange={(e) => handleFieldChange('text', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* CLASS */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Class</label>
          <input
            value={values.className}
            onChange={(e) => handleFieldChange('className', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* SPACING */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Padding</label>
            <input
              value={values.styles.padding}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Margin</label>
            <input
              value={values.styles.margin}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* FONT */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <input
            value={values.styles.fontSize}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* COLORS */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Background</label>
            <input
              type="color"
              value={values.styles.backgroundColor || '#ffffff'}
              onChange={(e) =>
                handleStyleChange('backgroundColor', e.target.value)
              }
              className="w-full h-9"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Text Color</label>
            <input
              type="color"
              value={values.styles.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-9"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPanel
