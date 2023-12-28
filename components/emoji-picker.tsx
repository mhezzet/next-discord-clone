'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'

interface IEmojiPicker {
  onChange: (value: string) => void
}

const EmojiPicker: React.FC<IEmojiPicker> = ({ onChange }) => {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className='h-6 w-6 text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300' />
      </PopoverTrigger>
      <PopoverContent
        className='mb-16 border-none bg-transparent shadow-none drop-shadow-none'
        side='right'
        sideOffset={40}
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
