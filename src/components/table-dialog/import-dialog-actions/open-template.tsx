import * as React from 'react'
import { openImportTemplate } from '@/graf/utils/tauri'
import { FolderOpenIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

import { Button } from '@/components/ui/button'

const OpenTemplate = ({ setLoading, setColumns, setSelected, data }) => {
  const handleOpenImportTemplate = React.useCallback(async () => {
    setLoading(true)
    const template = await openImportTemplate()
    setColumns(template.data.columns)
    setSelected((prev) => ({ ...prev, row: template.data.row }))
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
