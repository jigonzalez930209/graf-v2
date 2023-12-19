import React, { useState } from 'react'
import { LoadingsContext } from '@/graf/context/Loading'
import useImportData from '@/graf/hooks/useImportData'
import { ProcessFile } from '@/graf/interfaces/interfaces'
import { handleImport } from '@/graf/utils/dialog-table-utils'
import {
  Colors,
  CurrentSelected,
  ExcelTableData,
  ExcelTableSelected,
  Variables,
} from '@/graf/utils/import-dialog-interfaces'
import _ from 'lodash'
import { LayoutTemplate } from 'lucide-react'
import { useSnackbar } from 'notistack'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import ExcelTable from './excel-table'
import ImportFile from './template-dialog-actions/import-file'
import OpenTemplate from './template-dialog-actions/open-template'
import SaveTemplate from './template-dialog-actions/save-template'
import SelectionFooter from './template-dialog-actions/selection-footer'

// TODO: Add params input

const ImportDialog = () => {
  const { importDataTeq4Z } = useImportData()
  const { setLoading } = React.useContext(LoadingsContext)
  const [data, setData] = useState<ExcelTableData>()
  const [selected, setSelected] = useState<ExcelTableSelected>()
  const [open, setOpen] = useState(false)
  const [columns, setColumns] = useState<
    { col: number; variable: Variables; color: Colors; active: boolean }[]
  >([])

  const [isModulePhase, setIsModulePhase] = React.useState(true)

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
      <DialogTrigger>
        <CustomTooltip
          title='Make a new import template'
          Icon={<LayoutTemplate className='h-5 w-5' />}
        />
      </DialogTrigger>
      <DialogContent className='absolute flex h-[95%] max-w-[95%] flex-col gap-0 overflow-y-auto overflow-x-hidden'>
        <DialogTitle className='flex items-center gap-10'>
          Import Data From Text File
          <ImportFile
            {...{
              setColumns,
              setData,
              setSelected,
              setParams,
              setLoading,
            }}
          />
          <SaveTemplate
            {...{
              isModulePhase,
              setIsModulePhase,
              setLoading,
              selected,
              columns,
            }}
          />
          <OpenTemplate
            {...{
              setColumns,
              setSelected,
              setLoading,
              data,
              setIsModulePhase,
            }}
          />
        </DialogTitle>

        {data?.length && (
          <ExcelTable {...{ data, setData, selected, columns, setSelected }} />
        )}
        <DialogFooter className='relative bottom-0 right-0 mt-auto grid grid-cols-6 items-center justify-between'>
          <SelectionFooter
            {...{ selected, handleSelect, isModulePhase, setIsModulePhase }}
          />
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
