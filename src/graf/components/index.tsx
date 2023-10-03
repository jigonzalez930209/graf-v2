import * as React from 'react'
import { Backdrop } from '@mui/material'
import { listen } from '@tauri-apps/api/event'
import * as _ from 'lodash'

import AppBar from '@/components/app-bar'
import Drawer from '@/components/drawer'
import Loader from '@/components/loader'

import { GrafContext } from '../context/GraftContext'
import { LoadingsContext } from '../context/Loading'
import { useData } from '../hooks/useData'
import { IPlatform } from '../interfaces/interfaces'
import { readAllFiles, readFilesUsingTauriProcess } from '../utils'
import DragDrop from './FileList/drag-drop/DragDrop'
import PlotlyChart from './GrafContainer'

const Index: React.FC = () => {
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
    <>
      <AppBar />
      {loading && <Loader />}
      <div className='flex h-full w-full'>
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
