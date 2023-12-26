import ChannelList from '@/components/server/channel-list'
import ServerHeader from '@/components/server/server-header'
import ServerSearch from '@/components/server/server-search'
import { ScrollArea } from '@/components/ui/scroll-area'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { redirect } from 'next/navigation'

interface IServerSidebar {
  serverId: string
}

const ServerSidebar: React.FC<IServerSidebar> = async ({ serverId }) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.query.servers.findFirst({
    where: (servers, { eq }) => eq(servers.id, serverId),
    with: {
      channels: {
        orderBy: (channels, { asc }) => [asc(channels.createdAt)],
      },
      members: {
        with: {
          profile: true,
        },
        orderBy: (members, { asc }) => [asc(members.role)],
      },
    },
  })

  if (!server) return redirect('/')

  const textChannels = server.channels.filter((channel) => channel.type === 'TEXT')
  const audioChannels = server.channels.filter((channel) => channel.type === 'AUDIO')
  const videoChannels = server.channels.filter((channel) => channel.type === 'VIDEO')
  const members = server.members.filter((member) => member.profileId !== profile.id)
  const role = server.members.find((member) => member.profileId === profile.id)?.role!

  return (
    <div className='flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#18181b]'>
      <ServerHeader role={role} server={server} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            serverId={server.id}
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members.map((member) => ({
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
          <ChannelList />
        </div>
      </ScrollArea>
    </div>
  )
}

const iconMap = {
  TEXT: <Hash className='mr-2 h-4 w-4' />,
  AUDIO: <Mic className='mr-2 h-4 w-4' />,
  VIDEO: <Video className='mr-2 h-4 w-4' />,
}

const roleIconMap = {
  GUEST: null,
  ADMIN: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />,
  MODERATOR: <ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />,
}

export default ServerSidebar
