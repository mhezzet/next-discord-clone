'use client'
import { Plus } from 'lucide-react'
import ActionTooltip from '@/components/action-tooltip'
import CreateServerModal from '@/components/modals/create-server-modal'
import { useState } from 'react'

interface INavigationActions {}

const NavigationAction: React.FC<INavigationActions> = ({}) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <CreateServerModal open={open} onOpenChange={setOpen} />
      <ActionTooltip label='Add a server' side='right' align='center'>
        <button onClick={() => setOpen(true)} className='group flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center rounded-[24px] bg-[#F2F3F5] transition-all group-hover:rounded-[16px] group-hover:bg-[#18181b] dark:bg-neutral-700'>
            <Plus className='text-[#18181b] transition group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction
