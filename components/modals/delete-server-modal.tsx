'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import * as actions from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

interface IDeleteServerModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
  serverName: string
}

const DeleteServerModal: React.FC<IDeleteServerModal> = ({
  open,
  onOpenChange,
  serverId,
  serverName,
}) => {
  const [formState, action] = useFormState(actions.deleteServer, { message: '' })
  const router = useRouter()

  useEffect(() => {
    if (formState?.success) {
      onOpenChange(false)
    }
  }, [formState?.success, onOpenChange, router])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Delete Server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to delete{' '}
            <span className='font-bold text-indigo-500'>{serverName}</span> ?
          </DialogDescription>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <input type='hidden' name='serverId' value={serverId} />

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

export default DeleteServerModal
