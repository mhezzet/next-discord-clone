import { Loader2 } from 'lucide-react'

interface ILoading {}

const Loading: React.FC<ILoading> = ({}) => {
  return (
    <div className='flex h-full items-center justify-center'>
      <Loader2 className='animate-spin text-xl text-zinc-500' />
    </div>
  )
}

export default Loading
