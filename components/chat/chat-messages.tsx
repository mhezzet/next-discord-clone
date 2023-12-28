'use client'

import ChatItem from '@/components/chat/chat-item'
import ChatWelcome from '@/components/chat/chat-welcome'
import { useSocket } from '@/components/providers/socket-provider'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { channels, conversations, members, profiles } from '@/lib/db/schema'
import { getDirectMessages } from '@/lib/get-direct-messages'
import { getMessages } from '@/lib/get-messages'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export type Message =
  | {
      id: string
      createdAt: Date
      updatedAt: Date
      content: string
      fileUrl: string | null
      memberId: string
      channelId: string
      deleted: boolean | null
      member: typeof members._.inferSelect & {
        profile: typeof profiles._.inferSelect
      }
    }
  | {
      id: string
      createdAt: Date
      updatedAt: Date
      content: string
      fileUrl: string | null
      memberId: string
      deleted: boolean | null
      conversationId: string
      member: typeof members._.inferSelect & {
        profile: typeof profiles._.inferSelect
      }
    }

interface IChatMessages {
  channel?: typeof channels._.inferSelect
  conversation?: typeof conversations._.inferSelect
  type: 'channel' | 'conversation'
  name: string
  member: {
    id: string
    createdAt: Date
    updatedAt: Date
    profileId: string
    role: 'ADMIN' | 'MODERATOR' | 'GUEST'
    serverId: string
    profile: {
      id: string
      name: string
      userId: string
      imageUrl: string
      email: string
      createdAt: Date
      updatedAt: Date
    }
  }
}

const ChatMessages: React.FC<IChatMessages> = function ChatMessages({
  channel,
  conversation,
  type,
  name,
  member,
}) {
  const { socket, isConnected } = useSocket()
  const [page, setPage] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const hasMoreMessages = messages.length < totalMessages

  const fetchMessages = useCallback(
    async (pageNumber: number) => {
      setIsLoading(true)
      if (type === 'channel' && channel) {
        const { messages, count } = await getMessages(channel.id, pageNumber)
        setMessages((prevMessages) => [
          ...prevMessages,
          ...(messages.filter(
            (message) => !prevMessages.find((prevMessage) => prevMessage.id === message.id),
          ) as Message[]),
        ])
        setTotalMessages(count)
      } else if (type === 'conversation' && conversation) {
        const { messages, count } = await getDirectMessages(conversation.id, pageNumber)
        setMessages((prevMessages) => [
          ...prevMessages,
          ...(messages.filter(
            (message) => !prevMessages.find((prevMessage) => prevMessage.id === message.id),
          ) as Message[]),
        ])
        setTotalMessages(count)
      }
      setIsLoading(false)
      setPage((prevPage) => prevPage + 1)

      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    [channel, conversation, type],
  )

  const fetchMoreMessages = useCallback(() => {
    fetchMessages(page)
  }, [page, fetchMessages])

  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      fetchMessages(0)
    }
  }, [fetchMessages, isLoading, messages])

  useEffect(() => {
    if (!socket) return

    const serverId = params?.serverId as string

    const roomKey =
      type === 'channel'
        ? `server:${serverId}:channel:${channel?.id}`
        : `server:${serverId}:conversation:${conversation?.id}`

    socket.on(roomKey, (message: Message) => {
      setMessages((prevMessages) => [message, ...prevMessages])
    })

    return () => {
      socket.off(roomKey)
    }
  }, [socket, channel, conversation, type, params])

  useChatScroll({
    bottomRef,
    chatRef,
    loadMore: fetchMoreMessages,
    shouldLoadMore: hasMoreMessages,
    count: messages.length,
  })

  return (
    <div ref={chatRef} className='flex flex-1 flex-col overflow-y-auto py-4'>
      <div className='flex-1' />
      {!hasMoreMessages && <ChatWelcome type={type} name={name} />}

      {hasMoreMessages && (
        <div className='flex justify-center'>
          {isLoading ? (
            <Loader2 className='my-4 h-6 w-6 animate-spin text-zinc-500' />
          ) : (
            <button
              onClick={() => fetchMoreMessages()}
              className='my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className='mt-auto flex flex-col-reverse'>
        {messages.map((message) => (
          <ChatItem key={message.id} message={message} currentMember={member} type={type} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessages
