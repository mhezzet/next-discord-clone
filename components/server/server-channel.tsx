'use client'

import ActionTooltip from '@/components/action-tooltip'
import DeleteChannelModal from '@/components/modals/delete-channel-modal'
import UpdateChannelModal from '@/components/modals/update-channel-modal'
import { channels, members, profiles, servers } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { Delete, Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface IServerChannel {
  channel: {
    serverId: string
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    profileId: string
    type: 'TEXT' | 'AUDIO' | 'VIDEO'
  }
  server: typeof servers._.inferSelect & {
    members: (typeof members._.inferSelect & { profile: typeof profiles._.inferSelect })[]
    channels: (typeof channels._.inferSelect)[]
  }
  role: 'ADMIN' | 'MODERATOR' | 'GUEST'
}

const ServerChannel: React.FC<IServerChannel> = ({ channel, role, server }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[channel.type]

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`)
  }

  return (
    <>
      <DeleteChannelModal
        open={isDeleteOpen}
        serverId={server.id}
        channelId={channel.id}
        channelName={channel.name}
        onOpenChange={setIsDeleteOpen}
      />
      <UpdateChannelModal
        onOpenChange={setIsUpdateOpen}
        open={isUpdateOpen}
        serverId={server.id}
        channel={channel}
      />
      <button
        onClick={onClick}
        className={cn(
          'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
          params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
        )}
      >
        <Icon className='h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
        <p
          className={cn(
            'line-clamp-1 text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
            params?.channelId === channel.id &&
              'text-primary dark:text-zinc-200 dark:group-hover:text-white',
          )}
        >
          {channel.name}
        </p>
        {channel.name !== 'general' && role !== 'GUEST' && (
          <div className='ml-auto flex items-center gap-x-2'>
            <ActionTooltip label='Edit'>
              <Edit
                onClick={(e) => {
                  e.stopPropagation()
                  setIsUpdateOpen(true)
                }}
                className='hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
            <ActionTooltip label='Delete'>
              <Trash
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteOpen(true)
                }}
                className='hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === 'general' && (
          <Lock className='ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400 ' />
        )}
      </button>
    </>
  )
}

const iconMap = {
  TEXT: Hash,
  AUDIO: Mic,
  VIDEO: Video,
}

export default ServerChannel
