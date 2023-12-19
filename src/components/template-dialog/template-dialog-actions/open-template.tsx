import * as React from 'react'
import {
  ExcelTableData,
  ExcelTableSelected,
  Template,
} from '@/graf/utils/import-dialog-interfaces'
import { openImportTemplate } from '@/graf/utils/tauri'
import { FolderOpenIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { Button } from '@/components/ui/button'

type OpenTemplateProps = {
  setLoading: (boolean) => void
  setColumns: React.Dispatch<React.SetStateAction<Template['columns']>>
  setSelected: React.Dispatch<React.SetStateAction<ExcelTableSelected>>
  data: ExcelTableData
  setIsModulePhase: React.Dispatch<React.SetStateAction<boolean>>
}

const OpenTemplate = ({
  setLoading,
  setColumns,
  setSelected,
  data,
  setIsModulePhase,
}: OpenTemplateProps) => {
  const handleOpenImportTemplate = React.useCallback(async () => {
    setLoading(true)
    const template = await openImportTemplate()
    setColumns(template.data.columns)
    setSelected({ row: template.data.row, col: template.data.columns[0].col })
    setIsModulePhase(template.data.isModulePhase)
    enqueueSnackbar(template.notification.message, {
      variant: template.notification.variant,
    })
    setLoading(false)
  }, [])

  return (
    <Button
      onClick={handleOpenImportTemplate}
      className='h-6 w-6 rounded-full'
      variant='ghost'
      size='icon'
      disabled={!data}
    >
      <FolderOpenIcon className='h-4 w-4' />
    </Button>
  )
}

export default OpenTemplate
