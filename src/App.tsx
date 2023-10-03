import { cn } from '@/lib/utils'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { Menu } from '@/components/menu/menu'
import { ThemeProvider } from '@/components/theme-provider'

import { LoadingProvider } from './graf/context/Loading'
import Graf from './graf/Graf'

const App = () => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <ToastProvider>
        <LoadingProvider initialState={false}>
          <Toaster />
          <div className='h-screen overflow-clip'>
            <Menu />
            <div
              className={cn(
                'z-0 min-h-[calc(100vh-1rem)] overflow-auto border-t bg-background pb-8',
                'scrollbar-none',
                'scrollbar scrollbar-track-transparent',
                'scrollbar-thumb-accent scrollbar-thumb-rounded-md'
              )}
            >
              <Graf />
            </div>
          </div>
        </LoadingProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
export default App
