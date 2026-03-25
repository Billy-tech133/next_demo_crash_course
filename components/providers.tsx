'use client'

import posthog from '@/lib/posthog'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode } from 'react'

export function PHProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}