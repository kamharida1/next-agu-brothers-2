'use client'
import { cartStore } from '@/lib/hooks/useCartStore'
import useLayoutService from '@/lib/hooks/useLayout'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SWRConfig } from 'swr'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
  }) {
  const { theme } = useLayoutService()
  const [selectedTheme, setSelectedTheme] = useState('system')
  useEffect(() => {
    setSelectedTheme(theme)
  }, [theme])

  const updateStore = () => {
    cartStore.persist.rehydrate()
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', updateStore)
    window.addEventListener('focus', updateStore)
    return () => {
      document.removeEventListener('visibilitychange', updateStore)
      window.removeEventListener('focus', updateStore)
    }
  }, [])
  const fetcher = async (resource: string, init?: RequestInit) => {
    // Setup an AbortController for the fetch
    const controller = new AbortController();
    const signal = controller.signal;
    init = { ...init, signal };
  
    try {
      const res = await fetch(resource, init);
  
      // Handle non-200 status responses
      if (!res.ok) {
        const error = new Error(`Fetch failed with status: ${res.status}`);
        error.name = 'FetchError';
        throw error;
      }
  
      // Parse and return the JSON response
      return await res.json();
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error(`Failed to fetch from ${resource}:`, error);
        throw error;
      }
    }
  };
  return (
    <SWRConfig
      value={{
      fetcher,
      onError: (error, key) => {
        // Only show an error message for user-critical operations
        if (key.includes('/api/products')) {
          toast.error('Failed to load data. Please try again.');
        } else {
          toast.error(`Error fetching data from ${key}: ${error.message}`);
        }
      },
      revalidateOnFocus: false, // Disable re-fetch on window focus
      revalidateOnReconnect: false, // Disable re-fetch on reconnect
    }}
    >
      <div data-theme={selectedTheme}>
        <Toaster toastOptions={{ className: 'toaster-con' }} />
        {children}
      </div>
    </SWRConfig>
  )
}
