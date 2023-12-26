'use client'
import CreateChannelModal from '@/components/modals/create-channel-modal'
import DeleteServerModal from '@/components/modals/delete-server-modal'
import InviteModal from '@/components/modals/invite-modal'
import LeaveServerModal from '@/components/modals/leave-server-modal'
import MembersModal from '@/components/modals/members-modal'
import ServerSettingsModal from '@/components/modals/server-settings-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { channels, members, profiles, servers } from '@/lib/db/schema'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'

interface IServerHeader {
  role: (typeof members._.inferSelect)['role']
  server: typeof servers._.inferSelect & {
    members: (typeof members._.inferSelect & { profile: typeof profiles._.inferSelect })[]
    channels: (typeof channels._.inferSelect)[]
  }
}

const ServerHeader: React.FC<IServerHeader> = ({ role, server }) => {
  const [isInvitePeopleModalOpen, setIsInvitePeopleModalOpen] = useState(false)
  const [isServerSettingsModalOpen, setIsServerSettingsModalOpen] = useState(false)
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false)
  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] = useState(false)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [isLeaveServerModalOpen, setIsLeaveServerModalOpen] = useState(false)

  const isAdmin = role === 'ADMIN'
  const isModerator = isAdmin || role === 'MODERATOR'

  return (
    <>
      <InviteModal
        open={isInvitePeopleModalOpen}
        onOpenChange={setIsInvitePeopleModalOpen}
        inviteCode={server.inviteCode}
        serverId={server.id}
      />
      <ServerSettingsModal
        onOpenChange={setIsServerSettingsModalOpen}
        open={isServerSettingsModalOpen}
        serverId={server.id}
        serverName={server.name}
        serverUrl={server.imageUrl}
      />
      <MembersModal
        open={isManageMembersModalOpen}
        onOpenChange={setIsManageMembersModalOpen}
        serverId={server.id}
        serverProfileId={server.profileId}
        membersCount={server.members.length}
        members={server.members}
      />
      <CreateChannelModal
        open={isCreateChannelModalOpen}
        onOpenChange={setIsCreateChannelModalOpen}
        serverId={server.id}
      />
      <DeleteServerModal
        open={isDeleteServerModalOpen}
        onOpenChange={setIsDeleteServerModalOpen}
        serverId={server.id}
        serverName={server.name}
      />
      <LeaveServerModal
        open={isLeaveServerModalOpen}
        onOpenChange={setIsLeaveServerModalOpen}
        serverId={server.id}
        serverName={server.name}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' asChild>
          <button className='text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50'>
            {server.name}
            <ChevronDown className='g-5 ml-auto w-5' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400'>
          {isModerator && (
            <DropdownMenuItem
              onClick={() => setIsInvitePeopleModalOpen(true)}
              className='cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400'
            >
              Invite People
              <UserPlus className='ml-auto h-4 w-4 ' />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => setIsServerSettingsModalOpen(true)}
                className='cursor-pointer px-3 py-2 text-sm'
              >
                Server Settings
                <Settings className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsManageMembersModalOpen(true)}
                className='cursor-pointer px-3 py-2 text-sm'
              >
                Manage Members
                <Users className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
            </>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => setIsCreateChannelModalOpen(true)}
              className='cursor-pointer px-3 py-2 text-sm'
            >
              Create Channel
              <PlusCircle className='ml-auto h-4 w-4 ' />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() => setIsDeleteServerModalOpen(true)}
              className='cursor-pointer px-3 py-2 text-sm text-rose-500'
            >
              Delete Server
              <Trash className='ml-auto h-4 w-4' />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => setIsLeaveServerModalOpen(true)}
              className='cursor-pointer px-3 py-2 text-sm text-rose-500'
            >
              Leave Server
              <LogOut className='ml-auto h-4 w-4' />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ServerHeader
