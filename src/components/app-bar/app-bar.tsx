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
import FrequencyAnalysisDialog from '../frequency-analysis/frequency-analysis-dialog'
import ProjectHandler from './project-handler'
import { Settings } from './settings'

const Bar: React.FC = ({}) => {
  const {
    graftState: { fileType },
  } = React.useContext(GrafContext)

  return <div></div>
}

export default Bar
