import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CreateServerForm from '../forms/create-server'

interface IInitialModal {}

const InitialModal: React.FC<IInitialModal> = ({}) => {
  return (
    <Dialog open>
      <DialogContent className='overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl'>Customize your server</DialogTitle>
          <DialogDescription className='text-center '>
            Give your new server a personality with a name and an icon. You can always change it
            later.
          </DialogDescription>
        </DialogHeader>
        <CreateServerForm />
      </DialogContent>
    </Dialog>
  )
}

export default InitialModal
