import React from 'react'
import { listen } from '@tauri-apps/api/event'
import { SnackbarProvider } from 'notistack'

import Index from './components'
import { GrafContext } from './context/GraftContext'
import { LoadingsContext } from './context/Loading'
import { useData } from './hooks/useData'
import { IPlatform } from './interfaces/interfaces'
import { readAllFiles, readFilesUsingTauriProcess } from './utils'

const Graf = () => {
  const { updateData, data } = useData()
  const { graftState } = React.useContext(GrafContext)
  const {
    loading: { loading },
    setLoading,
  } = React.useContext(LoadingsContext)
  const [platform, setPlatform] = React.useState<IPlatform>(null)

  const readFiles = React.useCallback(async () => {
    setLoading(true)

    updateData(
      await readFilesUsingTauriProcess().finally(() => setLoading(false))
    )
  }, [])

  const handleFileDropChange = React.useCallback(async () => {
    // if (!window.__TAURI_METADATA__) {
    //   console.log('handleFileDropChange', window.__TAURI_METADATA__)
    //   return
    // }
    listen('tauri://file-drop', async (event) => {
      const files = await readAllFiles(event.payload)
      if (files.contents.length) {
        setLoading(true)
        updateData(await files.contents)
        setLoading(false)
      }
      if (files.notSupported.length) {
      }
    })
  }, [loading])

  React.useEffect(() => {
    handleFileDropChange()

    setPlatform('desktop')
    setLoading(false)
  }, [])

  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={8000}
      preventDuplicate
    >
      <Index />
    </SnackbarProvider>
  )
}
export default Graf
