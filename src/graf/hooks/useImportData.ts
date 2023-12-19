import * as React from 'react'

import { GrafContext } from '../context/GraftContext'
import { ProcessFile } from '../interfaces/interfaces'
import { generateRandomId } from '../utils/common'

export type ImportData = {
  name: string
  content: ProcessFile['content']
  color?: string
  impParams?: ProcessFile['impedance']
}

const useImportData = () => {
  const { setFile } = React.useContext(GrafContext)

  const importDataTeq4Z = ({ name, content, color, impParams }: ImportData) => {
    const file: ProcessFile = {
      id: generateRandomId(),
      name,
      type: 'teq4Z',
      content,
      color: color || 'gray',
      selected: false,
      impedance: impParams,
    }
    setFile(file)
  }

  return { importDataTeq4Z }
}

// TODO: Add import multiples files

export default useImportData
