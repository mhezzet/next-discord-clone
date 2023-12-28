'use client'

import { useUser } from '@clerk/nextjs'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface IMediaRoom {
  chatId: string
  video: boolean
  audio: boolean
}

const MediaRoom: React.FC<IMediaRoom> = (params) => {
  const { audio, chatId, video } = params
  const [token, setToken] = useState('')
  const { user } = useUser()

  useEffect(() => {}, [user])

  useEffect(() => {
    if (!user) return

    const name =
      user.firstName || user.lastName
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
        : user.username || user.emailAddresses[0].emailAddress?.split('@')[0]

    const getToken = async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`, {})
        const data = await resp.json()

        setToken(data.token)
      } catch (error) {
        console.error(error)
      }
    }

    getToken()
  }, [chatId, user])

  if (!token)
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    )

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default MediaRoom
