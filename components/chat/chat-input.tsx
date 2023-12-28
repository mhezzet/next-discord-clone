'use client'
import EmojiPicker from '@/components/emoji-picker'
import MessageFileModal from '@/components/modals/message-file-modal'
import { Input } from '@/components/ui/input'
import { sendDirectMessage, sendMessage } from '@/lib/actions'
import { Plus, Smile } from 'lucide-react'
import qs from 'query-string'
import { useRef, useState } from 'react'
import axios from 'axios'

interface IChatInputProps {
  type: 'channel' | 'conversation'
  name: string
  serverId: string
  channelId?: string
  conversationId?: string
  memberId?: string
  otherMemberId?: string
}

const ChatInput: React.FC<IChatInputProps> = ({
  name,
  serverId,
  type,
  channelId,
  conversationId,
  memberId,
  otherMemberId,
}) => {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSend()
  }

  const onSend = async () => {
    if (!value && !fileUrl) return

    setIsLoading(true)

    try {
      const apiUrl = '/api/socket/messages'

      if (type === 'channel') {
        const url = qs.stringifyUrl({
          url: apiUrl,
          query: {
            channelId,
            serverId,
            type,
          },
        })

        await axios.post(url, {
          fileUrl,
          content: fileUrl || value,
        })
      } else {
        const url = qs.stringifyUrl({
          url: apiUrl,
          query: {
            conversationId,
            serverId,
            type,
          },
        })

        await axios.post(url, {
          fileUrl,
          content: fileUrl || value,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setValue('')
      setFileUrl('')
      setIsFileModalOpen(false)
      setIsLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }
  }

  return (
    <>
      <MessageFileModal
        onOpenChange={setIsFileModalOpen}
        open={isFileModalOpen}
        setFileUrl={setFileUrl}
        fileUrl={fileUrl}
        onSend={onSend}
      />
      <form onSubmit={onSubmit}>
        <div className='relative p-4 pb-6'>
          <button
            type='button'
            onClick={() => setIsFileModalOpen(true)}
            className='absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300'
          >
            <Plus className='text-white dark:text-[#313338]' />
          </button>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete='off'
            disabled={isLoading}
            type='text'
            name='content'
            autoFocus
            placeholder={`Message ${type === 'channel' ? `#${name}` : name}`}
            className='border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200'
          />
          <div className='absolute right-8 top-7'>
            <EmojiPicker onChange={(emoji) => setValue((prev) => prev + emoji)} />
          </div>
        </div>
      </form>
    </>
  )
}

export default ChatInput
