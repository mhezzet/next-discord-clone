import NavigationAction from '@/components/navigation/navigation-action'
import { Separator } from '@/components/ui/separator'
import NavigationItems from '@/components/navigation/navigation-items'
import NavigationFooter from '@/components/navigation/navigation-footer'

interface INavigationSidebar {}

const NavigationSidebar: React.FC<INavigationSidebar> = async ({}) => {
  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 border-r py-3'>
      <NavigationAction />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <NavigationItems />
      <NavigationFooter />
    </div>
  )
}

export default NavigationSidebar
