import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'
import { initialProfile } from '@/lib/initial-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'

interface IInviteCode {
  params: { inviteCode: string }
}

const InviteCode: NextPage<IInviteCode> = async ({ params: { inviteCode } }) => {
  const profile = await initialProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.query.servers.findFirst({
    where: (servers, { eq }) => eq(servers.inviteCode, inviteCode),
  })

  if (!server) {
    throw new Error('Invalid invite code')
  }

  const isAlreadyMember = await db.query.members.findFirst({
    where: (members, { and, eq }) =>
      and(eq(members.serverId, server.id), eq(members.profileId, profile.id)),
  })

  const channel = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(eq(channels.name, 'general'), eq(channels.serverId, server.id)),
  })

  if (!channel) {
    return null
  }

  if (isAlreadyMember) {
    return redirect(`/servers/${channel.serverId}/channels/${channel.id}`)
  }

  await db.insert(members).values({
    profileId: profile.id,
    serverId: server.id,
    role: 'GUEST',
  })

  return redirect(`/servers/${channel.serverId}/channels/${channel.id}`)
}

export default InviteCode
