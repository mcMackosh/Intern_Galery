'use client'
import { PropsWithChildren} from 'react'
import { QueryProvider } from './quearyProvider'


export function MainProvider({ children }: PropsWithChildren) {

  return <QueryProvider>{children}</QueryProvider>
}