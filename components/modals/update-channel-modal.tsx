'use client'

import ServerErrorAlert from '@/components/server-error-alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as actions from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

interface IUpdateChannelModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
  channel: {
    serverId: string
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    profileId: string
    type: 'TEXT' | 'AUDIO' | 'VIDEO'
  }
}

const UpdateChannelModal: React.FC<IUpdateChannelModal> = ({
  open,
  onOpenChange,
  serverId,
  channel,
}) => {
  const [formState, action] = useFormState(actions.updateChannel, { errors: {} })
  const router = useRouter()

  useEffect(() => {
    if (formState?.success) {
      onOpenChange(false)
    }
  }, [serverId, formState?.success, onOpenChange, router])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Update Channel</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <input type='hidden' name='serverId' value={serverId} />
          <input type='hidden' name='channelId' value={channel.id} />
          <div className='space-y-8 px-6'>
            <div className='space-y-2'>
              <Label className='text-xs font-bold uppercase'>Channel name</Label>
              <Input placeholder='Enter channel name' name='name' defaultValue={channel.name} />
              {formState?.errors?.name && (
                <p className='text-sm text-destructive '>{formState.errors.name.join(', ')}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-xs font-bold uppercase'>Channel type</Label>
              <Select name='type' defaultValue={channel.type}>
                <SelectTrigger className='capitalize'>
                  <SelectValue placeholder='Select a channel type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='TEXT'>Text</SelectItem>
                  <SelectItem value='AUDIO'>Audio</SelectItem>
                  <SelectItem value='VIDEO'>Video</SelectItem>
                </SelectContent>
              </Select>
              {formState?.errors?.type && (
                <p className='text-sm text-destructive '>{formState.errors.type.join(', ')}</p>
              )}
            </div>
          </div>

          {formState?.errors?.general && (
            <div className='px-6'>
              <ServerErrorAlert message={formState.errors.general} />
            </div>
          )}

          <DialogFooter className='px-6 py-4'>
            <SubmitButton />
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
      {pending ? 'Updating...' : 'Update'}
    </Button>
  )
}

export default UpdateChannelModal
