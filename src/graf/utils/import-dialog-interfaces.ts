import React from 'react'
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

export type Variables = 'module' | 'phase' | 'frequency' | 'zi' | 'zr'
export type Colors = 'blue' | 'green' | 'red' | 'orange' | 'purple'

export type SelectionFooterProps = {
  selected: { row: number; col: number }
  isModulePhase: boolean
  setIsModulePhase: React.Dispatch<React.SetStateAction<boolean>>
  handleSelect: (currentSelected: CurrentSelected, isClean?: boolean) => void
}

export type CurrentSelected = {
  variable: Variables
  color: Colors
  active: boolean
}

export type Template = {
  columns: {
    col: number
    variable: Variables
    color: Colors
    active: boolean
  }[]
  row: number
  isModulePhase: boolean
}

export type TemplateFile = {
  name: string
  template: Template
  notification: { message: string; variant: 'success' | 'error' }
}
