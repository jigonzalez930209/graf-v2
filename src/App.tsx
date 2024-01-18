import React from 'react'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { SnackbarProvider } from 'notistack'

import { cn } from '@/lib/utils'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { Menu } from '@/components/menu/menu'
import { ThemeProvider } from '@/components/theme-provider'

import { LoadingProvider } from './graf/context/Loading'
import Graf from './graf/Graf'

const App = () => {
  const updater = React.useCallback(async () => {
    const update = await check()
      .then((x) => x)
      .catch((e) => e)
    console.log('update', update)

    if (update?.body?.length > 0) {
      await update.downloadAndInstall()
      await relaunch()
    }
  }, [])

  React.useEffect(() => {
    updater()
  }, [updater])

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <ToastProvider>
        <LoadingProvider initialState={false}>
          <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            autoHideDuration={8000}
            preventDuplicate
          >
            <Toaster />
            <div className='h-screen overflow-clip'>
              <Menu />
              <div
                className={cn(
                  'z-0 overflow-auto border-t bg-background pb-8',
                  'scrollbar-none',
                  ' max-h-[calc(100vh-0.1rem)] min-h-[calc(100vh-0.1rem)] min-w-[calc(100vw-0.1rem)] max-w-[calc(100vw-0.1rem)]',
                  'scrollbar scrollbar-track-transparent',
                  'scrollbar-thumb-accent scrollbar-thumb-rounded-md'
                )}
              >
                <Graf />
              </div>
            </div>
          </SnackbarProvider>
        </LoadingProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
export default App
