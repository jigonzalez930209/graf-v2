type NotificationType = 'error' | 'warning' | 'success' | 'info' | null

export interface INotification {
  title: string
  content: string[]
  type: NotificationType
}

interface IState {}

export interface IGraftState {
  notifications: INotification
  state: IState
  fileType: IFileType
  loading: boolean
  graftType: IGrafType
  impedanceType: IGraftImpedanceType
  stepBetweenPoints: IStepBetweenPoints
  lineOrPointWidth: number
  drawerOpen: boolean
  csvFileColum: csvFileColum[]
  files: ProcessFile[]
  platform: IPlatform
  isFilesGrouped: boolean
  colorScheme: IColorScheme
  selectedFilesCount: number
  uniqueFrequencyCalc: FrequencyValues[]
  concInputValues: ConcInputValue[]
}

export type IPlatform = 'web' | 'desktop' | null

export type IGrafType = 'line' | 'scatter'

export type IGraftImpedanceType = 'Bode' | 'Nyquist' | 'ZiZrVsFreq'

export type IFileType = 'teq4Z' | 'teq4' | 'csv' | null

export type IGraftData =
  | 'IMPEDANCE_MODULE_FASE'
  | 'IMPEDANCE_ZiZr'
  | 'VC_V_vs_I'
  | 'VC_t_vs_I'

export type IStepBetweenPoints = number

export type File = {
  id: number
  name: string
  content: string | string[][]
  selected: boolean
  columns?: string[]
  invariableContent?: string[][]
  selectedInvariableContentIndex?: number
}

export type ExportData = {
  name: string
  value: {
    Time?: number
    Frequency?: number
    Module?: number
    Fase?: number
    ZI?: number
    ZR?: number
  }[]
}[]

export type ProcessFile = {
  id: string
  name: string
  type: 'teq4' | 'teq4Z' | 'csv'
  pointNumber?: number
  content: string[][]
  selected: boolean | string
  invariableContent?: string[][]
  selectedInvariableContentIndex?: number
  color: string
  impedance?: {
    V: number
    signalAmplitude: number
    sFrequency: number
    eFrequency: number
    totalPoints: number
  }
  voltammeter?: {
    samplesSec: number
    range: number
    totalTime: number
    cicles: number
  }
  csv?: {
    columns: string[]
  }
}

export type Files = {
  files: File[]
}
export type csvFileColum = {
  id: string
  fileName: string
  selected: boolean | string
  x?: columns
  y?: columns
  y2?: columns
  notSelected?: columns
}

export type columns = {
  name: string
  index: number
  color?: string
}[]

export type IColorScheme = string

export type SortedByFrequency = {
  [freq: number]: {
    module: number
    value: number
    phase: number
    zi: number
    zr: number
  }[]
}

export type FrequencyValues = {
  [i: number]: {
    frequency: number
    module: { m: number; b: number; r: number }
    phase: { m: number; b: number; r: number }
    zi: { m: number; b: number; r: number }
    zr: { m: number; b: number; r: number }
  }
}

export type ConcInputValue = {
  id: ProcessFile['id']
  name: ProcessFile['name']
  value: number
}
