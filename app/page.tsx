import InitialModal from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'
import { and } from 'drizzle-orm'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'

const Setup: NextPage = async ({}) => {
  const profile = await initialProfile()

  const memberOfAnyServer = await db.query.members.findFirst({
    where: (members, { eq }) => eq(members.profileId, profile.id),
  })

  if (memberOfAnyServer) {
    const channel = await db.query.channels.findFirst({
      where: (channels, { eq }) =>
        and(eq(channels.name, 'general'), eq(channels.serverId, memberOfAnyServer.serverId)),
    })
    return redirect(`/servers/${memberOfAnyServer.serverId}/channels/${channel?.id}`)
  }

  return (
    <main>
      <InitialModal />
    </main>
  )
}

export default Setup
