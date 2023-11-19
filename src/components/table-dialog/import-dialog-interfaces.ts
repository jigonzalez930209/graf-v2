import { CellValue, RowObject } from 'handsontable/common'

export type ExcelTableData =
  | Array<{ [key: string]: string }>
  | Array<Array<string | number | boolean>>
  | CellValue[][]
  | RowObject[]

export type ExcelTableSelected = {
  row: number
  col: number
}

export type Columns = {
  col: number
  variable: Variables
  color: Colors
}[]

export type ExcelTableProps = {
  columns: Columns
  data: ExcelTableData
  setData: React.Dispatch<React.SetStateAction<ExcelTableData>>
  selected: ExcelTableSelected
  setSelected: React.Dispatch<React.SetStateAction<ExcelTableSelected>>
}

export type Variables = 'module' | 'phase' | 'frequency'
export type Colors = 'blue' | 'green' | 'red'

export type SelectionFooterProps = {
  selected: { row: number; col: number }
  handleSelect: (currentSelected: CurrentSelected) => void
}

export type CurrentSelected = {
  variable: Variables
  color: Colors
  active: boolean
}
