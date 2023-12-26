'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface IServerSearch {
  serverId: string
  data: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}

const ServerSearch: React.FC<IServerSearch> = ({ data, serverId }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && e.ctrlKey) || e.metaKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [])

  const onClick = (id: string, type: 'channel' | 'member') => {
    setOpen(false)

    if (type === 'channel') {
      router.push(`/servers/${serverId}/channels/${id}`)
    } else {
      router.push(`/servers/${serverId}/conversations/${id}`)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'
      >
        <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
        <p className='text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300'>
          Search
        </p>
        <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[14px] font-medium text-muted-foreground'>
          <span className='text-xs'>⌘</span>
          <span>K</span>
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>No Result found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ icon, name, id }) => {
                  return (
                    <CommandItem onClick={() => onClick(id, type)} key={id}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
