'use client'

import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'


export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // кеш 5 хвилин
          },
        },
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}