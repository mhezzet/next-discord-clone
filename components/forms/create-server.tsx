'use client'

import * as actions from '@/actions'
import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Server name is required',
    })
    .max(32, { message: 'Server name is too long' }),
  imageUrl: z
    .string()
    .url({ message: 'Invalid image UR' })
    .min(1, { message: 'Server image is required' }),
})

interface ICreateServerForm {}

const CreateServerForm: React.FC<ICreateServerForm> = ({}) => {
  const [formState, action] = useFormState(actions.createServer, {
    message: '',
  })
  const form = useForm({
    defaultValues: {
      name: '',
      imageUrl: '',
    },
    resolver: zodResolver(formSchema),
  })
  const onSubmit = form.handleSubmit((data) => action(data))

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div className='space-y-8 px-6'>
          <div className='flex items-center justify-center text-center'>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint='serverImage'
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-bold uppercase'>Server name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter server name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className='px-6 py-4'>
          <Button variant='default'>Create</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default CreateServerForm
