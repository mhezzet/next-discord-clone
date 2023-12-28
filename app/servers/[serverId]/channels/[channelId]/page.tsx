import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import MediaRoom from '@/components/media-room'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface IChannelPage {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelPage: React.FC<IChannelPage> = async ({ params }) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const channel = await db.query.channels.findFirst({
    where: (channels, { eq, and }) => eq(channels.id, params.channelId),
  })

  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.profileId, profile.id), eq(members.serverId, params.serverId)),
    with: {
      profile: true,
    },
  })

  if (!member || !channel) {
    return redirect('/')
  }

  return (
    <div className='full flex h-full flex-col'>
      <ChatHeader type='channel' name={channel.name} serverId={channel.serverId} />
      {channel.type === 'TEXT' && (
        <ChatMessages type='channel' channel={channel} name={channel.name} member={member} />
      )}

      {channel.type === 'AUDIO' && <MediaRoom chatId={channel.id} audio video={false} />}
      {channel.type === 'VIDEO' && <MediaRoom chatId={channel.id} video audio />}

      {channel.type === 'TEXT' && (
        <ChatInput
          channelId={channel.id}
          name={channel.name}
          serverId={params.serverId}
          memberId={member.id}
          type='channel'
        />
      )}
    </div>
  )
}

export default ChannelPage
