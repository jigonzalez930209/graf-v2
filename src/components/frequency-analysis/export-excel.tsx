import React from 'react'
import { GrafContext } from '@/graf/context/GraftContext'
import { exportExcelFrequency } from '@/graf/utils/common'
import { FileUp } from 'lucide-react'

import { Button } from '../ui/button'

const ExportToExcel = () => {
  const {
    graftState: { uniqueFrequencyCalc, concInputValues },
  } = React.useContext(GrafContext)

  return (
    <Button
      className='h-7 w-7 rounded-full'
      variant='ghost'
      size='icon'
      onClick={() =>
        exportExcelFrequency({
          uniqueFrequencyCalc,
          concInputValues,
          fileName: `Frequency_Analysis_${new Date().toUTCString()}`,
        })
      }
    >
      <FileUp className='h-4 w-4' />
    </Button>
  )
}

export default ExportToExcel
