import React from 'react'

export const Footer:React.FC = () => {

    const year:any = new Date().getFullYear()
    
  return (
    <div className='text-center py-4 text-gray-400 text-sm border-t border-gray-800 mt-24'>
    <p>Copyright @{year} Ai website-Builder, Made by Srisai</p>
    </div>
  )
}
