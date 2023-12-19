import * as React from 'react'
import { homogenizeMatrix } from '@/graf/utils/common'
import { Import } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import XLSX from 'xlsx'

import { Button } from '@/components/ui/button'

const ImportFile = ({
  setLoading,
  setData,
  setSelected,
  setColumns,
  setParams,
}) => {
  const inputRefImportFile = React.useRef<HTMLInputElement>(null)

  const handleImportClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    setData(null)
    setSelected(null)
    setColumns([])
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setParams((prev) => ({ ...prev, name: file.name }))
      const fileName = file.name.toLocaleLowerCase()
      const binaryString = event.target?.result as string
      if (fileName.endsWith('.csv')) {
        const workbook = XLSX.read(binaryString, {
          type: 'binary',
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        setData(homogenizeMatrix(data, ''))
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

        setData(homogenizeMatrix(data, ''))
      } else if (
        fileName.toLocaleLowerCase().endsWith('.xls') ||
        fileName.endsWith('.xlsx')
      ) {
        const workbook = XLSX.read(binaryString, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        setData(homogenizeMatrix(data, ''))
      } else {
        enqueueSnackbar('File type not supported', { variant: 'error' })
      }
    }
    reader.readAsBinaryString(file)
    event.target.value = null
    setLoading(false)
  }

  const handleClickOpenFile = () => inputRefImportFile.current.click()

  return (
    <>
      <Button
        onClick={handleClickOpenFile}
        className='h-6 w-6 rounded-full'
        variant='ghost'
        size='icon'
      >
        <Import className='h-4 w-4' />
      </Button>
      <input
        ref={inputRefImportFile}
        style={{ display: 'none' }}
        type='file'
        onChange={handleImportClick}
      />
    </>
  )
}

export default ImportFile
