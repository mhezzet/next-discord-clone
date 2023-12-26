'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/user-avatar'
import * as actions from '@/lib/actions'
import { profiles } from '@/lib/db/schema'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useState, useTransition } from 'react'

interface IMembersModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
  membersCount: number
  serverProfileId: string
  members: ({
    id: string
    profileId: string
    createdAt: Date
    updatedAt: Date
    role: 'ADMIN' | 'MODERATOR' | 'GUEST'
    serverId: string
  } & {
    profile: typeof profiles._.inferSelect
  })[]
}

const MembersModal: React.FC<IMembersModal> = ({
  open,
  onOpenChange,
  serverId,
  membersCount,
  members,
  serverProfileId,
}) => {
  const [loadingId, setLoadingId] = useState('')

  const onRoleChange = async (memberId: string, role: 'ADMIN' | 'MODERATOR' | 'GUEST') => {
    setLoadingId(memberId)

    try {
      await actions.changeMemberRole(memberId, role, serverId)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId('')
    }
  }

  const onKick = async (memberId: string) => {
    setLoadingId(memberId)

    try {
      await actions.kickMember(memberId, serverId)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Manage Members</DialogTitle>
          <DialogDescription className='text-center'>{membersCount} Members</DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {members.map((member) => (
            <div key={member.id} className='mb-6 flex items-center gap-x-2'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='flex items-center text-xs font-semibold'>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs'>{member.profile.email}</p>
              </div>
              {serverProfileId !== member.profileId &&
                (loadingId === member.id ? (
                  <Loader2 className='ml-auto h-4 w-4 animate-spin' />
                ) : (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='h-4 w-4' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex items-center'>
                            <ShieldQuestion className='mr-2 h-4 w-4' />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
                                <Shield className='mr-2 h-4 w-4' />
                                Guest
                                {member.role === 'GUEST' && <Check className='ml-auto h-4 w-4' />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'MODERATOR')}
                              >
                                <ShieldCheck className='mr-2 h-4 w-4' />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className='ml-auto h-4 w-4' />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className='mr-2 h-4 w-4' />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const roleIconMap = {
  ADMIN: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />,
  MODERATOR: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  GUEST: null,
}

export default MembersModal
