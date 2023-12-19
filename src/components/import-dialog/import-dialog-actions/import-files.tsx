import * as React from 'react'
import { homogenizeMatrix } from '@/graf/utils/common'
import { PlusIcon } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import XLSX from 'xlsx'

import { Button } from '@/components/ui/button'

import FileListSelector from './file-list-selector'

export type importedFile = {
  name: string
  content: string[][]
}

type ImportFilesProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<importedFile | null>>
  selectedFile: importedFile | null
  setImportedFiles: React.Dispatch<React.SetStateAction<importedFile[]>>
  importedFiles: {
    name: string
    content: string[][]
  }[]
  disabled: boolean
}
const ImportFiles = ({
  setSelectedFile,
  selectedFile,
  setImportedFiles,
  importedFiles,
  disabled,
}: ImportFilesProps) => {
  const inputRefImportFile = React.useRef<HTMLInputElement>(null)

  const handleImportClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files.length < 1) {
      return
    }

    const readFile = (file: File) => {
      return new Promise<{ name: string; content: string[][] }>(
        (resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const fileName = file.name.toLocaleLowerCase()
            const binaryString = event.target?.result as string

            if (fileName.endsWith('.csv')) {
              const workbook = XLSX.read(binaryString, {
                type: 'binary',
              })
              const sheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[sheetName]
              const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

              resolve({
                name: fileName,
                content: homogenizeMatrix(data, ''),
              })
            } else if (fileName.endsWith('.txt')) {
              const workbook = XLSX.read(
                binaryString
                  // eliminate all \r\n and replace all spaces with tabs
                  .replace(/\r\n/g, '\n')
                  // Eliminate all spaces before a any letter except number and replace with ''
                  .replace(/ (\D)/g, '$1')
                  // Eliminate all \t\r\f\v,;:"' and replace with \t
                  .replace(/[ \t\r\f\v,;:"']+/g, '\t'),
                {
                  type: 'binary',
                  FS: '\t',
                }
              )
              const sheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[sheetName]
              const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

              resolve({
                name: fileName,
                content: homogenizeMatrix(data, ''),
              })
            } else if (
              fileName.toLocaleLowerCase().endsWith('.xls') ||
              fileName.endsWith('.xlsx')
            ) {
              const workbook = XLSX.read(binaryString, { type: 'binary' })
              const sheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[sheetName]
              const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

              resolve({
                name: fileName,
                content: homogenizeMatrix(data, ''),
              })
            } else {
              reject('File type not supported')
            }
          }
          reader.readAsBinaryString(file)
        }
      )
    }

    const promises = Array.from(files).map((file) => readFile(file))

    Promise.all(promises)
      .then((results) => {
        setImportedFiles(results)
        console.log(results)
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' })
      })
  }

  const handleClickOpenFile = () => inputRefImportFile.current.click()

  return (
    <div>
      <FileListSelector
        items={importedFiles}
        selectedItem={selectedFile}
        setSelectedItem={setSelectedFile}
        title='Files Selected'
      />
      <Button
        onClick={handleClickOpenFile}
        disabled={disabled}
        className='w-3/4'
      >
        <PlusIcon className='h-5 w-5' />
        <span>Select Files</span>
      </Button>
      <input
        ref={inputRefImportFile}
        className='hidden'
        style={{ display: 'none' }}
        type='file'
        multiple
        onChange={handleImportClick}
        accept='.csv, .txt'
      />
    </div>
  )
}

export default ImportFiles
