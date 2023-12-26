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

interface ICreateChannelModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
}

const CreateChannelModal: React.FC<ICreateChannelModal> = ({ open, onOpenChange, serverId }) => {
  const [formState, action] = useFormState(actions.createChannel, { errors: {} })
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
          <DialogTitle className='text-center text-2xl font-bold'>Create Channel</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <div className='space-y-8 px-6'>
            <div className='space-y-2'>
              <Label className='text-xs font-bold uppercase'>Channel name</Label>
              <input type='hidden' name='serverId' value={serverId} />
              <Input placeholder='Enter channel name' name='name' />
              {formState?.errors?.name && (
                <p className='text-sm text-destructive '>{formState.errors.name.join(', ')}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-xs font-bold uppercase'>Channel type</Label>
              <Select name='type'>
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
      {pending ? 'Creating...' : 'Create'}
    </Button>
  )
}

export default CreateChannelModal
