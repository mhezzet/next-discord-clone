import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { RedirectToSignIn } from '@clerk/nextjs'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'

interface IServerPage {
  params: {
    serverId: string
  }
}

const ServerPage: NextPage<IServerPage> = async ({ params }) => {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }

  const channel = await db.query.channels.findFirst({
    where: (channels, { eq, and }) =>
      and(eq(channels.name, 'general'), eq(channels.serverId, params.serverId)),
  })

  if (!channel) {
    return null
  }
  return redirect(`/servers/${channel.serverId}/channels/${channel.id}`)
}

export default ServerPage
