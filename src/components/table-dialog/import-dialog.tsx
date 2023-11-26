import React, { useState } from 'react'
import useImportData from '@/graf/hooks/useImportData'
import { ProcessFile } from '@/graf/interfaces/interfaces'
import { homogenizeMatrix } from '@/graf/utils/common'
import _ from 'lodash'
import { Import } from 'lucide-react'
import { useSnackbar } from 'notistack'
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
  const { importDataTeq4Z } = useImportData()
  const [data, setData] = useState<ExcelTableData>()
  const [selected, setSelected] = useState<ExcelTableSelected>()
  const [open, setOpen] = useState(false)
  const inputRefImportFile = React.useRef<HTMLInputElement>(null)
  const [columns, setColumns] = useState<
    { col: number; variable: Variables; color: Colors; active: boolean }[]
  >([])

  const { enqueueSnackbar } = useSnackbar()

  const [params, setParams] = useState<
    ProcessFile['impedance'] & { name: string }
  >({
    name: '',
    V: 0,
    eFrequency: 0,
    sFrequency: 0,
    signalAmplitude: 0,
    totalPoints: 0,
  })

  const handleClickOpenFile = () => inputRefImportFile.current.click()

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
      setParams((prev) => ({ ...prev, name: file.name }))
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
      } else {
        enqueueSnackbar('File type not supported', { variant: 'error' })
      }
    }
    reader.readAsBinaryString(file)
    event.target.value = null
  }

  const handleSelect = (currentSelected: CurrentSelected, isClean = false) => {
    if (isClean) {
      setColumns((prev) => prev.filter((c) => c.variable === 'frequency'))
      return
    }
    setColumns((prev) =>
      prev?.length
        ? _.uniqBy(
            [{ col: selected?.col, ...currentSelected }, ...prev],
            'variable'
          )
        : [{ col: selected?.col, ...currentSelected }]
    )
  }

  const handleImport = () => {
    try {
      const index = {
        frequency: columns.find((c) => c.variable === 'frequency').col - 1,
        module: columns.find((c) => c.variable === 'module')?.col - 1,
        phase: columns.find((c) => c.variable === 'phase')?.col - 1,
        zr: columns.find((c) => c.variable === 'zr')?.col - 1,
        zi: columns.find((c) => c.variable === 'zi')?.col - 1,
      }

      const sortData =
        selected.row > 0
          ? data
              .filter((_, i) => i >= selected?.row)
              .map((row) => [
                '',
                row[index.frequency],
                Number.isNaN(index.module)
                  ? Math.sqrt(row[index.zi] ** 2 + row[index.zr] ** 2)
                  : row[index.module],
                Number.isNaN(index.phase)
                  ? -Math.atan(row[index.zi] / row[index.zr]) * (180 / Math.PI)
                  : row[index.phase],
              ])
          : data.map((row) => [
              '',
              row[index.frequency],
              Number.isNaN(index.module)
                ? Math.sqrt(row[index.zi] ** 2 + row[index.zr] ** 2)
                : row[index.module],
              Number.isNaN(index.phase)
                ? -Math.atan(row[index.zi] / row[index.zr]) * (180 / Math.PI)
                : row[index.phase],
            ])

      const currentParams = { ...params }
      delete currentParams.name
      importDataTeq4Z({
        name: params.name,
        impParams: {
          ...currentParams,
          eFrequency: Math.max(...sortData.map((s) => s[1])),
          sFrequency: Math.min(...sortData.map((s) => s[1])),
          totalPoints: sortData.length,
        },
        content: sortData,
      })
      setOpen(false)
    } catch (e) {
      enqueueSnackbar('Something went wrong' + e, { variant: 'error' })
      console.log(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='absolute flex h-[95%] max-w-[95%] flex-col gap-0 overflow-y-auto overflow-x-hidden'>
        <DialogTitle className='flex items-center gap-10'>
          Import Data From Text File
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
          {/* TODO: Add params input */}
          <div className='flex justify-end gap-3'>
            <Button variant='destructive' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='default'
              disabled={columns.length < 3}
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
