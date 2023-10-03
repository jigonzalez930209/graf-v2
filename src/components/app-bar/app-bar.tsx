import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Button } from '@/components/ui/button'
import {
  Popover as CustomPopover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { GrafContext } from '../../graf/context/GraftContext'
import { useData } from '../../graf/hooks/useData'
import ExportModal from '../export-dialog'
import { Project } from './project'
import ProjectHandler from './project-handler'
import { Settings } from './settings'

const Bar: React.FC = ({}) => {
  const { cleanData } = useData()

  const {
    graftState: { drawerOpen, fileType },
    setDrawerOpen,
  } = React.useContext(GrafContext)

  const handleOpenFiles = () => {}

  return (
    <div className='mt-2 flex gap-3 pl-4 '>
      <CustomPopover>
        <PopoverTrigger>
          <Button className='uppercase' variant='ghost'>
            Project
          </Button>
        </PopoverTrigger>
        <PopoverContent className=' bg-secondary'>
          <Project />
          <Popover.Arrow className='fill-primary' />
        </PopoverContent>
      </CustomPopover>
      <CustomPopover>
        <PopoverTrigger>
          <Button className='uppercase' variant='ghost'>
            settings
          </Button>
        </PopoverTrigger>
        <PopoverContent className='h-auto w-auto bg-secondary'>
          <Settings />
          <Popover.Arrow className='fill-primary' />
        </PopoverContent>
      </CustomPopover>
      <ProjectHandler />
      <ExportModal />
    </div>
  )
}

export default Bar
