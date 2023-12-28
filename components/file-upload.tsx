import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

interface IFileUpload {
  endpoint: 'messageFile' | 'serverImage'
  onChange: (url: string) => void
  value: string
}

const FileUpload: React.FC<IFileUpload> = ({ endpoint, onChange, value }) => {
  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20 '>
        <Image src={value} fill alt='Uploaded' className='rounded-full' sizes='33vw' />
        <button
          onClick={() => onChange('')}
          type='button'
          className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='round-md relative mt-2 flex items-center rounded-sm bg-zinc-800/50 p-2'>
        <FileIcon className='mr-2 h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
        >
          PDF File
        </a>
        <button
          onClick={() => onChange('')}
          type='button'
          className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onUploadError={console.error}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      appearance={{ container: ({}) => 'border-gray-500/50' }}
    />
  )
}

export default FileUpload
