import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import MediaRoom from '@/components/media-room'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface IMemberPage {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberPage: React.FC<IMemberPage> = async ({
  params: { memberId, serverId },
  searchParams: { video },
}) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.profileId, profile.id), eq(members.serverId, serverId)),
    with: {
      profile: true,
    },
  })

  if (!member) {
    redirect('/')
  }

  const conversation = await getOrCreateConversation(member.id, memberId)

  if (!conversation) {
    const channel = await db.query.channels.findFirst({
      where: (channels, { eq, and }) =>
        and(eq(channels.name, 'general'), eq(channels.serverId, serverId)),
    })

    if (!channel) {
      return null
    }
    return redirect(`/servers/${channel.serverId}/channels/${channel.id}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className='flex h-full flex-col'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type='conversation'
        serverId={serverId}
      />
      {!video && (
        <>
          <ChatMessages
            type='conversation'
            conversation={conversation}
            name={otherMember.profile.name}
            member={member}
          />
          <ChatInput
            conversationId={conversation.id}
            name={otherMember.profile.name}
            serverId={serverId}
            memberId={member.id}
            otherMemberId={otherMember.id}
            type='conversation'
          />
        </>
      )}
      {video && <MediaRoom chatId={conversation.id} audio video />}
    </div>
  )
}

export default MemberPage
