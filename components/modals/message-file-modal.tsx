'use client'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface IMessageFileModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileUrl: string
  setFileUrl: (url: string) => void
  onSend: () => void
}

const MessageFileModal: React.FC<IMessageFileModal> = ({
  open,
  onOpenChange,
  fileUrl,
  setFileUrl,
  onSend,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Add an attachment</DialogTitle>
          <DialogDescription className='text-center '>send a file as message</DialogDescription>
        </DialogHeader>
        <div className='space-y-8 px-6'>
          <div className='flex flex-col items-center justify-center gap-2 text-center'>
            <FileUpload endpoint='messageFile' onChange={setFileUrl} value={fileUrl} />
          </div>
        </div>

        <DialogFooter className='px-6 py-4'>
          <Button onClick={onSend} disabled={!fileUrl} type='submit' variant='default'>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal
