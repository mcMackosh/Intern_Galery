'use client'
import { PropsWithChildren} from 'react'
import { QueryProvider } from './quearyProvider'
import { ReduxProvider } from './reduxProvide'


export function MainProvider({ children }: PropsWithChildren) {

  return <ReduxProvider><QueryProvider>{children}</QueryProvider></ReduxProvider>
}