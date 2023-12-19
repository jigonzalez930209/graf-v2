import * as React from 'react'
import {
  ExcelTableSelected,
  Template,
} from '@/graf/utils/import-dialog-interfaces'
import { saveImportTemplate } from '@/graf/utils/tauri'
import { SaveIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { Button } from '@/components/ui/button'

type SaveTemplateProps = {
  setLoading: (boolean) => void
  columns: Template['columns']
  selected: ExcelTableSelected
  isModulePhase: boolean
}

const SaveTemplate = ({
  setLoading,
  columns,
  selected,
  isModulePhase,
}: SaveTemplateProps) => {
  const handleClickSaveFileTemplate = React.useCallback(async () => {
    setLoading(true)
    const notification = await saveImportTemplate({
      columns,
      row: selected.row || 0,
      isModulePhase,
    })
    enqueueSnackbar(notification.message, { variant: notification.variant })
    setLoading(false)
  }, [columns])

  return (
    <>
      <Button
        onClick={handleClickSaveFileTemplate}
        className='h-6 w-6 rounded-full'
        variant='ghost'
        size='icon'
        disabled={columns.length < 2}
      >
        <SaveIcon className='h-4 w-4' />
      </Button>
    </>
  )
}

export default SaveTemplate
