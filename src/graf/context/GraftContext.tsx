import * as React from 'react'

import {
  csvFileColum,
  IFileType,
  IGraftImpedanceType,
  IGraftState,
  IGrafType,
  INotification,
  IPlatform,
  ProcessFile,
} from '../interfaces/interfaces'

export type GrafContextProps = {
  graftState: IGraftState
  setNotification: (notification: INotification) => void
  setSelectedFile: (selectedFileType: IFileType) => void
  setGraftType: (type: IGrafType) => void
  setImpedanceType: (type: IGraftImpedanceType) => void
  setStepBetweenPoints: (step: number) => void
  setLineOrPointWidth: (width: number) => void
  setDrawerOpen: (open: boolean) => void
  setSelectedColumns: (columns: csvFileColum[]) => void
  setFiles: (files: ProcessFile[]) => void
  setGraftState: (graftState: IGraftState) => void
  updateFile: (file: ProcessFile) => void
  updateCSVfileColumn: (csvFileColum: csvFileColum) => void
  setPlatform: (platform: IPlatform) => void
  setIsFilesGrouped: (isFileGrouped: boolean) => void
}

export const GrafContext = React.createContext<GrafContextProps>(
  {} as GrafContextProps
)
