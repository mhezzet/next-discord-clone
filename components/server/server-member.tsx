'use client'
import UserAvatar from '@/components/user-avatar'
import { members, profiles, servers } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface IServerMember {
  member: {
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
  }
  server: typeof servers._.inferSelect & {
    members: (typeof members._.inferSelect & { profile: typeof profiles._.inferSelect })[]
  }
}

const ServerMember: React.FC<IServerMember> = ({ member, server }) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`)
  }

  const icon = roleIconMap[member.role]

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className='h-8 w-8 md:h-8 md:w-8' />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  ADMIN: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />,
}

export default ServerMember
