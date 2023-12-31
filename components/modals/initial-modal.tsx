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
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

interface IInitialModal {}

const InitialModal: React.FC<IInitialModal> = ({}) => {
  const [formState, action] = useFormState(actions.createServerIntial, { errors: {} })
  const [imageUrl, setImageUrl] = useState('')

  return (
    <Dialog open>
      <DialogContent closeButton={false} className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-center '>
            Give your new server a personality with a name and an icon. You can always change it
            later.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <div className='space-y-8 px-6'>
            <div className='flex flex-col items-center justify-center gap-2 text-center'>
              <FileUpload endpoint='serverImage' onChange={setImageUrl} value={imageUrl} />
              {formState.errors?.imageUrl && (
                <p className='text-center text-sm text-destructive'>
                  {formState.errors.imageUrl.join(', ')}
                </p>
              )}
              <input type='hidden' name='imageUrl' value={imageUrl} />
            </div>

            <div className='space-y-2'>
              <Label className='text-xs font-bold uppercase'>Server name</Label>
              <Input placeholder='Enter server name' name='name' />
              {formState.errors?.name && (
                <p className='text-sm text-destructive '>{formState.errors.name.join(', ')}</p>
              )}
            </div>
          </div>

          {formState.errors?.general && (
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

export default InitialModal
