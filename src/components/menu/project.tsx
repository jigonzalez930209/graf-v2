import * as React from 'react'
import { GrafContext } from '@/graf/context/GraftContext'
import { useData } from '@/graf/hooks/useData'
import { readAllFiles, readFilesUsingTauriProcess } from '@/graf/utils'
import { listen } from '@tauri-apps/api/event'

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../ui/menubar'
import { useToast } from '../ui/use-toast'

export const ProjectMenu = () => {
  const { graftState, setFiles, setGraftState } = React.useContext(GrafContext)
  const [loading, setLoading] = React.useState(false)
  const t = useToast()
  const { updateData, addFiles } = useData()

  const addNewProject = () => {}

  const readFiles = React.useCallback(async () => {
    setLoading(true)

    updateData(
      await readFilesUsingTauriProcess().finally(() => setLoading(false))
    )
  }, [])

  const addFilesToState = React.useCallback(async () => {
    setLoading(true)

    addFiles(
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
      if (files.notSupported.length)
        t.toast({
          title: 'Error Reading Files',
          description: `Not supported files: ${files.notSupported.join(', ')}`,
        })
    })
  }, [])

  React.useEffect(() => {
    handleFileDropChange()
  }, [window.__TAURI_METADATA__])

  return (
    <MenubarMenu>
      <MenubarTrigger className='relative hover:bg-secondary'>
        Project
      </MenubarTrigger>
      <MenubarContent>
        {/* TODO: Implement handle project in next versions */}
        <MenubarItem disabled onClick={addNewProject}>
          New
          {/* <MenubarShortcut>⌘N</MenubarShortcut> */}
        </MenubarItem>
        <MenubarItem onClick={readFiles}>
          Open files
          {/* <MenubarShortcut>⌘O</MenubarShortcut> */}
        </MenubarItem>
        <MenubarItem onClick={addFilesToState}>
          Add files
          {/* <MenubarShortcut>⌘O</MenubarShortcut> */}
        </MenubarItem>

        <MenubarItem disabled>
          Save
          {/* <MenubarShortcut>⌘S</MenubarShortcut> */}
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem disabled>
          Import
          {/* <MenubarShortcut>⌘I</MenubarShortcut> */}
        </MenubarItem>
        <MenubarItem disabled>
          Export
          {/* <MenubarShortcut>⌘E</MenubarShortcut> */}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
