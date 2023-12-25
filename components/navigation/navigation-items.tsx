import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import NavigationItem from '@/components/navigation/navigation-item'

interface INavigationItems {}

const NavigationItems: React.FC<INavigationItems> = async ({}) => {
  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const membership = await db.query.members.findMany({
    where: (members, { eq }) => eq(members.profileId, profile.id),
    columns: {
      serverId: true,
    },
  })

  const serversIds = membership.map((member) => member.serverId)

  if (!serversIds.length) return redirect('/')

  const servers = await db.query.servers.findMany({
    where: (servers, { inArray }) => inArray(servers.id, serversIds),
    columns: {
      id: true,
      name: true,
      imageUrl: true,
    },
  })

  return (
    <ScrollArea className='w-full flex-1'>
      {servers.map((server) => (
        <div className='mb-4' key={server.id}>
          <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
        </div>
      ))}
    </ScrollArea>
  )
}

export default NavigationItems
