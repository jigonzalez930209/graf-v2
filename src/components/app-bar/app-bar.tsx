import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Button } from '@/components/ui/button'
import {
  Popover as CustomPopover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { GrafContext } from '../../graf/context/GraftContext'
import ExportModal from '../export-dialog'
import ProjectHandler from './project-handler'
import { Settings } from './settings'

const Bar: React.FC = ({}) => {
  const {
    graftState: { fileType },
  } = React.useContext(GrafContext)

  return (
    <div className='mt-2 flex gap-3 pl-4 '>
      {/* <CustomPopover>
        <PopoverTrigger>
          <Button className='uppercase' variant='ghost'>
            Project
          </Button>
        </PopoverTrigger>
        <PopoverContent className=' bg-secondary'>
          <Project />
          <Popover.Arrow className='fill-primary' />
        </PopoverContent>
      </CustomPopover> */}
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
      {!['csv', null].includes(fileType) && (
        <ExportModal>
          <Button className='uppercase' variant='ghost'>
            Export
          </Button>
        </ExportModal>
      )}
    </div>
  )
}

export default Bar
