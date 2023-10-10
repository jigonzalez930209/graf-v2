'use client'

import * as React from 'react'
import { getName, getVersion } from '@tauri-apps/plugin-app'
import { AreaChartIcon } from 'lucide-react'
import { WindowTitlebar } from 'tauri-controls'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { AboutDialog } from '../about-dialog'
import { Dialog, DialogTrigger } from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import { MenuModeToggle } from './menu-mode-toggle'
import { ProjectMenu } from './project'

export function Menu() {
  const [name, setName] = React.useState('')

  const closeWindow = React.useCallback(async () => {
    const {getCurrent  } = await import('@tauri-apps/plugin-window')

    getCurrent().close()
  }, [])

  React.useEffect(() => {
    let name = ''
    getName().then((x) =>
      getVersion()
        .then((y) => (name = `${x}_${y}`))
        .finally(() => setName(name))
    )
  }, [window.__TAURI_METADATA__])

  return (
    <WindowTitlebar className='justify-start' windowControlsProps={
      {
        "data-tauri-drag-region": true,
      }
    } >
      <Menubar className='z-50 w-min rounded-none border-b border-none pl-2 lg:pl-3'>
        <MenubarMenu>
          <CustomTooltip
            title='Graf is a tool for creating and managing graphs.'
            Icon={
              <div className='inline-flex h-fit w-fit items-center text-cyan-500'>
                <AreaChartIcon className='h-5 w-5' />
              </div>
            }
          />
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className='mx-auto min-w-max font-bold capitalize'>
            {name}
          </MenubarTrigger>
          <Dialog modal={false}>
            <MenubarContent>
              <DialogTrigger asChild>
                <MenubarItem>About App</MenubarItem>
              </DialogTrigger>

              <MenubarSeparator />
              <MenubarItem>
                Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Hide Music... <MenubarShortcut>⌘H</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Hide Others... <MenubarShortcut>⇧⌘H</MenubarShortcut>
              </MenubarItem>
              <MenubarShortcut />
              <MenubarItem onClick={closeWindow}>
                Quit Music <MenubarShortcut>⌘Q</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
            <AboutDialog />
          </Dialog>
        </MenubarMenu>
        <ProjectMenu />

        <MenuModeToggle />
      </Menubar>
    </WindowTitlebar>
  )
}
