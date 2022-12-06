import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'
import { supabase } from 'utils/supabase'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()
  const validateSession = async () => {
    const user = supabase.auth.user()
    if (user && pathname === '/') {
      push('notes')
    } else if (!user && pathname !== '/') {
      await push('/')
    }
  }
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/notes')
    }
    if (event === 'SIGNED_OUT') {
      push('/')
    }
  })
  useEffect(() => {
    validateSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
