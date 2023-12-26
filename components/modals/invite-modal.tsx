'use client'

import ServerErrorAlert from '@/components/server-error-alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrigin } from '@/hooks/use-origin'
import * as actions from '@/lib/actions'
import { cn } from '@/lib/utils'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

interface IInviteModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
  serverId: string
}

const InviteModal: React.FC<IInviteModal> = ({ open, onOpenChange, inviteCode, serverId }) => {
  const [formState, action] = useFormState(actions.generateInviteLink, { message: '' })
  const [copied, setCopied] = useState(false)
  const origin = useOrigin()

  const inviteUrl = `${origin}/invite/${inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Invite Friends</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <div className='p-6'>
            <Label className='text-xs font-bold uppercase '>Server invite link</Label>
            <div className='mt-2 flex items-center gap-x-2'>
              <Input
                readOnly
                className='focus-visible:ring-0 focus-visible:ring-offset-0'
                value={inviteUrl}
              />
              <input type='hidden' name='serverId' value={serverId} />
              <Button type='button' onClick={onCopy} variant='outline' size='icon'>
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </Button>
            </div>
            <SubmitButton />
            {formState.message && (
              <div className='mt-4'>
                <ServerErrorAlert message={formState.message} />
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type='submit' variant='link' size='sm' className='tex-xs mt-4'>
      Generate a new link
      <RefreshCw className={cn('ml-2 h-4 w-4', pending && 'animate-spin')} />
    </Button>
  )
}

export default InviteModal
