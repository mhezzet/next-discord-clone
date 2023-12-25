import { ModeToggle } from '@/components/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { Suspense } from 'react'

interface INavigationFooter {}

const NavigationFooter: React.FC<INavigationFooter> = ({}) => {
  return (
    <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
      <ModeToggle />

      <div className='h-[48px]'>
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationFooter
