import React, { useState } from 'react'
import { LoadingsContext } from '@/graf/context/Loading'
import useImportData from '@/graf/hooks/useImportData'
import { ProcessFile } from '@/graf/interfaces/interfaces'
import { homogenizeMatrix } from '@/graf/utils/common'
import { openImportTemplate, saveImportTemplate } from '@/graf/utils/tauri'
import _ from 'lodash'
import { FolderOpenIcon, Import, SaveIcon } from 'lucide-react'
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
import { handleImport } from './dialog-table-utils'
import ExcelTable from './excel-table'
import ImportFile from './import-dialog-actions/import-file'
import OpenTemplate from './import-dialog-actions/open-template'
import SaveTemplate from './import-dialog-actions/save-template'
import SelectionFooter from './import-dialog-actions/selection-footer'
import {
  Colors,
  CurrentSelected,
  ExcelTableData,
  ExcelTableSelected,
  Variables,
} from './import-dialog-interfaces'

// TODO: Fix selections errors when importing data from template file and separate in different components for each button action

const ImportDialog = ({ children }) => {
  const { importDataTeq4Z } = useImportData()
  const { setLoading } = React.useContext(LoadingsContext)
  const [data, setData] = useState<ExcelTableData>()
  const [selected, setSelected] = useState<ExcelTableSelected>()
  const [open, setOpen] = useState(false)
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

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='absolute flex h-[95%] max-w-[95%] flex-col gap-0 overflow-y-auto overflow-x-hidden'>
        <DialogTitle className='flex items-center gap-10'>
          Import Data From Text File
          <ImportFile
            setColumns={setColumns}
            setData={setData}
            setSelected={setSelected}
            setParams={setParams}
            setLoading={setLoading}
          />
          <SaveTemplate
            columns={columns}
            selected={selected}
            setLoading={setLoading}
          />
          <OpenTemplate
            setColumns={setColumns}
            setSelected={setSelected}
            setLoading={setLoading}
            data={data}
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
              onClick={() =>
                handleImport({
                  columns,
                  data,
                  params,
                  importDataTeq4Z,
                  enqueueSnackbar,
                  setLoading,
                  setOpen,
                  selected,
                })
              }
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
