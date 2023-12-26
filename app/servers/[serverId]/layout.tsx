import Loading from '@/app/loading'
import ServerSidebar from '@/components/server/server-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface ILayout {
  children: React.ReactNode
  params: {
    serverId: string
  }
}

const Layout: React.FC<ILayout> = async ({ children, params: { serverId } }) => {
  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-20 hidden h-full w-60 flex-col border-r md:flex'>
        <Suspense fallback={<Skeleton className='m-4 h-full' />}>
          <Channels serverId={serverId} />
        </Suspense>
      </div>
      <main className='h-full border-r md:pl-60'>{children}</main>
    </div>
  )
}

const Channels = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const memberOfServer = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.profileId, profile.id), eq(members.serverId, serverId)),
  })

  if (!memberOfServer) return redirect('/')
  return <ServerSidebar serverId={serverId} />
}

export default Layout
