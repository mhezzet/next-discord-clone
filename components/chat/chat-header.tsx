import MobileToggle from '@/components/mobile-toggle'
import SocketIndicator from '@/components/socket-indicator'
import UserAvatar from '@/components/user-avatar'
import { Hash, Menu } from 'lucide-react'
import ChatInput from './chat-input'
import ChatVideoButton from '@/components/chat/chat-video-button'

interface IChatHeader {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

const ChatHeader: React.FC<IChatHeader> = ({ imageUrl, name, serverId, type }) => {
  return (
    <div className='flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className='mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400' />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className='mr-2 h-8 w-8 md:h-8 md:w-8' />
      )}
      <p className='font-semibold '>{name}</p>
      <div className='ml-auto flex items-center'>
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
