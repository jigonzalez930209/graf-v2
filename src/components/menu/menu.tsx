'use client'

import * as React from 'react'
import { SettingsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { GrafContext } from '../../graf/context/GraftContext'
import { AboutDialog } from '../about-dialog'
import ProjectHandler from '../app-bar/project-handler'
import { Settings } from '../app-bar/settings'
import ExportModal from '../export-dialog'
import FrequencyAnalysisDialog from '../frequency-analysis/frequency-analysis-dialog'
import ImportFile from '../import-dialog'
import ImportDialog from '../template-dialog/import-dialog'
import { Dialog, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import { MenuModeToggle } from './menu-mode-toggle'
import { ProjectMenu } from './project'

export function Menu() {
  const [name, setName] = React.useState('')
  const {
    graftState: { fileType },
  } = React.useContext(GrafContext)

  const closeWindow = React.useCallback(async () => {
    const { getCurrent } = await import('@tauri-apps/plugin-window')

    getCurrent().close()
  }, [])

  React.useEffect(() => {
    let name = ''
    // getName().then((x) =>
    //   getVersion()
    //     .then((y) => (name = `${x}_${y}`))
    //     .finally(() => setName(name))
    // )
  }, [window.__TAURI_METADATA__])

  return (
    <Menubar className='z-50 w-full rounded-none border-b border-none pl-2 lg:pl-3'>
      <MenubarMenu>
        <MenubarTrigger className='mx-auto min-w-max font-bold capitalize hover:bg-secondary'>
          {name}
        </MenubarTrigger>
        <Dialog modal={false}>
          <MenubarContent>
            <DialogTrigger asChild>
              <MenubarItem>About App</MenubarItem>
            </DialogTrigger>

            <MenubarSeparator />
            <MenubarShortcut />
            <MenubarItem onClick={closeWindow}>
              Quit
              {/* <MenubarShortcut >⌘Q</MenubarShortcut> */}
            </MenubarItem>
          </MenubarContent>
          <AboutDialog />
        </Dialog>
      </MenubarMenu>
      <ProjectMenu />

      <MenuModeToggle />
      <div className='flex w-full justify-center gap-3 pl-4'>
        <Popover>
          <PopoverTrigger>
            <CustomTooltip
              title='Settings'
              Icon={<SettingsIcon className='h-5 w-5' />}
            />
          </PopoverTrigger>
          <PopoverContent className='h-auto w-auto bg-secondary'>
            <Settings />
            <PopoverArrow className='fill-primary' />
          </PopoverContent>
        </Popover>
        <ProjectHandler />
        {!['csv', null].includes(fileType) && (
          <ExportModal>
            <Button className='uppercase' variant='ghost'>
              Export
            </Button>
          </ExportModal>
        )}

        <FrequencyAnalysisDialog />
        <ImportDialog />
        <ImportFile />
      </div>
    </Menubar>
  )
}
