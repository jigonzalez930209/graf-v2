import { ImportData } from '@/graf/hooks/useImportData'
import { ProcessFile } from '@/graf/interfaces/interfaces'
import {
  Colors,
  ExcelTableData,
  Variables,
} from '@/graf/utils/import-dialog-interfaces'
import { EnqueueSnackbar } from 'notistack'

type HandleImportProps = {
  columns: {
    col: number
    variable: Variables
    color: Colors
    active: boolean
  }[]
  selected: {
    col: number
    row: number
  }
  data: ExcelTableData
  setLoading: (loading: boolean) => void
  setOpen: (open: boolean) => void
  params: ProcessFile['impedance'] & { name: string }
  importDataTeq4Z: (d: ImportData) => void
  enqueueSnackbar: EnqueueSnackbar
}

const handleImport = ({
  setLoading,
  columns,
  selected,
  data,
  importDataTeq4Z,
  params,
  setOpen,
  enqueueSnackbar,
}: HandleImportProps) => {
  setLoading(true)
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
  } finally {
    setLoading(false)
  }
}

export { handleImport }
