import * as React from 'react'
import { listen } from '@tauri-apps/api/event'

import AppBar from '@/components/app-bar'
import DragDrop from '@/components/drag-drop/drag-drop'
import Drawer from '@/components/drawer'
import Loader from '@/components/loader'
import PlotlyChart from '@/components/plot'

import { GrafContext } from '../context/GraftContext'
import { LoadingsContext } from '../context/Loading'
import { useData } from '../hooks/useData'
import { readAllFiles, readFilesUsingTauriProcess } from '../utils'

const Index: React.FC = () => {
  const { updateData } = useData()
  const { graftState } = React.useContext(GrafContext)
  const {
    loading: { loading },
    setLoading,
  } = React.useContext(LoadingsContext)

  const readFiles = React.useCallback(async () => {
    setLoading(true)

    updateData(
      await readFilesUsingTauriProcess().finally(() => setLoading(false))
    )
  }, [])

  const handleFileDropChange = React.useCallback(async () => {
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

    setLoading(false)
  }, [])

  return (
    <>
      <AppBar />
      {loading && <Loader />}
      <div className='flex max-h-full max-w-full'>
        <Drawer variant='left' />
        {graftState?.fileType === 'csv' ? (
          <DragDrop PlotlyChart={<PlotlyChart />} />
        ) : (
          <PlotlyChart />
        )}
      </div>
    </>
  )
}

export default Index
