import ActionTooltip from '@/components/action-tooltip'
import { Message } from '@/components/chat/chat-messages'
import UserAvatar from '@/components/user-avatar'
import { format } from 'date-fns'
import { FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface IChatItem {
  message: Message
  currentMember: {
    id: string
    createdAt: Date
    updatedAt: Date
    profileId: string
    role: 'ADMIN' | 'MODERATOR' | 'GUEST'
    serverId: string
    profile: {
      id: string
      name: string
      userId: string
      imageUrl: string
      email: string
      createdAt: Date
      updatedAt: Date
    }
  }
  type: 'channel' | 'conversation'
}

const ChatItem: React.FC<IChatItem> = ({ currentMember, message }) => {
  const router = useRouter()

  const timestamp = format(new Date(message.createdAt), 'd MMM yyyy, HH:mm')
  const isAdmin = currentMember.role === 'ADMIN'
  const isModerator = currentMember.role === 'MODERATOR'
  const isOwner = currentMember.profile.id === message.member.profile.id
  const canDeleteMessage = !message.deleted || isAdmin || isModerator || isOwner
  const fileType = message.fileUrl?.split('.').pop()
  const isPdf = fileType === 'pdf'
  const isImage = !isPdf && message.fileUrl

  const onMemberClick = () => {
    if (currentMember.id === message.member.id) return

    router.push(`/servers/${message.member.serverId}/conversations/${message.member.id}`)
  }

  return (
    <div className='group relative flex w-full items-center p-4 transition hover:bg-black/5 hover:dark:bg-zinc-500/5'>
      <div className='group flex w-full items-start gap-x-2'>
        <div onClick={onMemberClick} className='cursor-pointer transition hover:drop-shadow-md'>
          <UserAvatar src={message.member.profile.imageUrl} />
        </div>
        <div className='flex w-full flex-col'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center '>
              <p
                onClick={onMemberClick}
                className='cursor-pointer text-sm font-semibold hover:underline'
              >
                {message.member.profile.name}
              </p>
              <ActionTooltip label={message.member.role}>
                {iconMap[message.member.role]}
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={message.fileUrl!}
              target='_blank'
              rel='noopener noreferrer'
              className='relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary'
            >
              <Image src={message.fileUrl!} fill alt={message.content} className='object-cover' />
            </a>
          )}
          {isPdf && (
            <div className='round-md relative mt-2 flex items-center rounded-sm bg-zinc-800/50 p-2'>
              <FileIcon className='mr-2 h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={message.fileUrl!}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
              >
                PDF File
              </a>
            </div>
          )}
          {!message.fileUrl && (
            <p className='text-sm text-zinc-600 dark:text-zinc-300'>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const iconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  ADMIN: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />,
}

export default ChatItem
