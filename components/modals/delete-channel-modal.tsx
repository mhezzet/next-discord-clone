'use client'

import FileUpload from '@/components/file-upload'
import ServerErrorAlert from '@/components/server-error-alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as actions from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

interface IDeleteChannelModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
  channelId: string
  channelName: string
}

const DeleteChannelModal: React.FC<IDeleteChannelModal> = ({
  open,
  onOpenChange,
  serverId,
  channelId,
  channelName,
}) => {
  const [formState, action] = useFormState(actions.deleteChannel, { message: '' })

  useEffect(() => {
    if (formState?.success) {
      onOpenChange(false)
    }
  }, [formState?.success, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Delete Channel</DialogTitle>
          <DialogDescription className='text-center '>
            Are you sure you want to delete{' '}
            <span className='font-bold text-indigo-500'>#{channelName}</span> ?
          </DialogDescription>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <input type='hidden' name='serverId' value={serverId} />
          <input type='hidden' name='channelId' value={channelId} />

          <DialogFooter className='px-6 py-4'>
            <div className='flex w-full items-center justify-between'>
              <Button onClick={() => onOpenChange(false)} variant='outline' type='button'>
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type='submit' variant='default'>
      {pending ? 'Deleting...' : 'Confirm'}
    </Button>
  )
}

export default DeleteChannelModal
