'use client'
import ServerErrorAlert from '@/components/server-error-alert'
import { NextPage } from 'next'

interface IError {
  error: Error
  reset: () => void
}

const ErrorPage: NextPage<IError> = ({ error }) => {
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='w-full max-w-xl px-4'>
        <ServerErrorAlert message={error.message} />
      </div>
    </div>
  )
}

export default ErrorPage
