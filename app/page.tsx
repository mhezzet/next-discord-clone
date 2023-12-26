import InitialModal from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'

const Setup: NextPage = async ({}) => {
  const profile = await initialProfile()

  const memberOfAnyServer = await db.query.members.findFirst({
    where: (members, { eq }) => eq(members.profileId, profile.id),
  })

  if (memberOfAnyServer) {
    return redirect(`/servers/${memberOfAnyServer.serverId}`)
  }

  return (
    <main>
      <InitialModal />
    </main>
  )
}

export default Setup
