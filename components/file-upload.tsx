import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import { X } from 'lucide-react'
import Image from 'next/image'

interface IFileUpload {
  endpoint: 'messageFile' | 'serverImage'
  onChange: (url?: string) => void
  value: string
}

const FileUpload: React.FC<IFileUpload> = ({ endpoint, onChange, value }) => {
  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image src={value} fill alt='Uploaded' className='rounded-full' />
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onUploadError={console.error}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
    />
  )
}

export default FileUpload
