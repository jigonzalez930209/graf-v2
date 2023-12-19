import * as React from 'react'
import { TemplateFile } from '@/graf/utils/import-dialog-interfaces'
import { openImportTemplates } from '@/graf/utils/tauri'
import { PlusIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

import FileListSelector from './file-list-selector'

type ImportTemplateProps = {
  selectedTemplate: TemplateFile | null
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateFile | null>>
  templates: TemplateFile[]
  setTemplates: React.Dispatch<React.SetStateAction<TemplateFile[] | null>>
}

const ImportTemplate = ({
  selectedTemplate,
  setSelectedTemplate,
  templates,
  setTemplates,
}: ImportTemplateProps) => {
  const handleImport = React.useCallback(async () => {
    const template = await openImportTemplates()
    setTemplates(template.data)
  }, [])

  return (
    <div>
      <FileListSelector
        items={templates}
        selectedItem={selectedTemplate}
        setSelectedItem={setSelectedTemplate}
        title='Templates Selected '
      />
      <Button onClick={handleImport} className='w-3/4'>
        <PlusIcon className='h-5 w-5' />
        <span>Select Templates</span>
      </Button>
    </div>
  )
}

export default ImportTemplate
