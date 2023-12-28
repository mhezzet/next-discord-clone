'use client'

import ActionTooltip from '@/components/action-tooltip'
import CreateChannelModal from '@/components/modals/create-channel-modal'
import MembersModal from '@/components/modals/members-modal'
import { members } from '@/lib/db/schema'
import { Plus, Settings } from 'lucide-react'
import { useState } from 'react'

interface IServerSection {
  label: string
  role?: typeof members._.inferSelect.role
  sectionType: 'channels' | 'members'
  channelType?: 'TEXT' | 'AUDIO' | 'VIDEO'
  serverId: string
  serverProfileId: string
  membersCount: number
  members: ({
    id: string
    profileId: string
    createdAt: Date
    updatedAt: Date
    role: 'ADMIN' | 'MODERATOR' | 'GUEST'
    serverId: string
  } & {
    profile: {
      id: string
      name: string
      userId: string
      imageUrl: string
      email: string
      createdAt: Date
      updatedAt: Date
    }
  })[]
}

const ServerSection: React.FC<IServerSection> = ({
  label,
  sectionType,
  channelType,
  role,
  serverId,
  membersCount,
  members,
  serverProfileId,
}) => {
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

  return (
    <div className='flex items-center justify-between py-2'>
      <CreateChannelModal
        serverId={serverId}
        onOpenChange={setIsCreateChannelOpen}
        open={isCreateChannelOpen}
      />
      <MembersModal
        serverId={serverId}
        serverProfileId={serverProfileId}
        open={isMembersModalOpen}
        onOpenChange={setIsMembersModalOpen}
        members={members}
        membersCount={membersCount}
      />
      <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>{label}</p>
      {role !== 'GUEST' && sectionType === 'channels' && (
        <ActionTooltip side='top' label='Create Channel'>
          <button
            onClick={() => setIsCreateChannelOpen(true)}
            className='text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Plus className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}

      {role === 'ADMIN' && sectionType === 'members' && (
        <ActionTooltip side='top' label='Manage Members'>
          <button
            onClick={() => setIsMembersModalOpen(true)}
            className='text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Settings className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
