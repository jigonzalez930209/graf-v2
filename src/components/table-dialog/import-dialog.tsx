import React, { useState } from 'react'
import { homogenizeMatrix } from '@/graf/utils/common'
import _ from 'lodash'
import { Import } from 'lucide-react'
import * as XLSX from 'xlsx'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import ExcelTable from './excel-table'
import {
  Colors,
  CurrentSelected,
  ExcelTableData,
  ExcelTableSelected,
  Variables,
} from './import-dialog-interfaces'
import SelectionFooter from './selection-footer'

const ImportDialog = ({ children }) => {
  const [data, setData] = useState<ExcelTableData>()
  const [selected, setSelected] = useState<ExcelTableSelected>()
  const [open, setOpen] = useState(true)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [columns, setColumns] = useState<
    { col: number; variable: Variables; color: Colors; active: boolean }[]
  >([])

  const handleClick = () => inputRef.current.click()

  const handleImportClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(null)
    setSelected(null)
    setColumns([])
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const fileName = file.name.toLocaleLowerCase()
      const binaryString = event.target?.result as string
      if (fileName.endsWith('.csv')) {
        const workbook = XLSX.read(
          binaryString,

          {
            type: 'binary',
          }
        )
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
      }
    }
    reader.readAsBinaryString(file)
    event.target.value = null
  }

  const handleSelect = (currentSelected: CurrentSelected) => {
    setColumns((prev) =>
      prev?.length
        ? _.uniqBy(
            [{ col: selected.col, ...currentSelected }, ...prev],
            'variable'
          )
        : [{ col: selected.col, ...currentSelected }]
    )
  }
  // TODO: Add a selected columns and rows to a building (new) file
  const handleImport = () => {
    console.log(
      data
        .filter((_, i) => i >= selected?.row - 1)
        .map((row) => columns.map((c) => ({ [c.variable]: row[c.col - 1] })))
    )
    // setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='absolute flex h-[95%] max-w-[95%] flex-col gap-0 overflow-y-auto overflow-x-hidden'>
        <DialogTitle className='flex items-center gap-10'>
          Import
          <Button
            onClick={handleClick}
            className='h-6 w-6 rounded-full'
            variant='ghost'
            size='icon'
          >
            <Import className='h-4 w-4' />
          </Button>
          <input
            ref={inputRef}
            style={{ display: 'none' }}
            type='file'
            onChange={handleImportClick}
          />
        </DialogTitle>

        {data?.length && (
          <ExcelTable
            data={data}
            setData={setData}
            selected={selected}
            columns={columns}
            setSelected={setSelected}
          />
        )}
        <DialogFooter className='relative bottom-0 right-0 mt-auto grid grid-cols-6 items-center justify-between'>
          <SelectionFooter selected={selected} handleSelect={handleSelect} />
          <div className='flex justify-end gap-3'>
            <Button variant='destructive' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='default'
              disabled={columns.length < 3 || !Boolean(selected?.row)}
              onClick={handleImport}
            >
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog
