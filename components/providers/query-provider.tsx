'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface IQueryProvider {
  children: React.ReactNode
}

const QueryProvider: React.FC<IQueryProvider> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
