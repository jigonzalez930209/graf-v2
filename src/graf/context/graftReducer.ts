import {
  ConcInputValue,
  csvFileColum,
  FrequencyValues,
  IColorScheme,
  IFileType,
  IGraftImpedanceType,
  IGraftState,
  IGrafType,
  INotification,
  IPlatform,
  IStepBetweenPoints,
  ProcessFile,
} from '../interfaces/interfaces'

type GraftAction = {
  type:
    | 'setNotification'
    | 'setFileType'
    | 'setGraftType'
    | 'setImpedanceType'
    | 'setStepBetweenPoints'
    | 'setDrawerOpen'
    | 'setSelectedColumns'
    | 'setFiles'
    | 'setGraftState'
    | 'updateFile'
    | 'updateCSVfileColumn'
    | 'setPlatform'
    | 'setLineOrPointWidth'
    | 'setIsFilesGrouped'
    | 'setColorScheme'
    | 'setSelectedFilesCount'
    | 'setCalcToUniqueFrequency'
    | 'setSelectFilesToCalcUniqueFrequency'
  payload:
    | INotification
    | IFileType
    | boolean
    | IGrafType
    | IGraftImpedanceType
    | IStepBetweenPoints
    | boolean
    | csvFileColum[]
    | ProcessFile[]
    | IGraftState
    | ProcessFile
    | csvFileColum
    | IPlatform
    | IColorScheme
    | FrequencyValues[]
    | ConcInputValue[]
}

export const graftReducer = (
  state: IGraftState,
  action: GraftAction
): IGraftState => {
  switch (action.type) {
    case 'setNotification':
      return {
        ...state,
        notifications: action.payload as INotification,
      }
    case 'setFileType':
      return {
        ...state,
        fileType: action.payload as IFileType,
      }
    case 'setGraftType':
      return {
        ...state,
        graftType: action.payload as IGrafType,
      }
    case 'setImpedanceType':
      return {
        ...state,
        impedanceType: action.payload as IGraftImpedanceType,
      }
    case 'setStepBetweenPoints':
      return {
        ...state,
        stepBetweenPoints: action.payload as IStepBetweenPoints,
      }
    case 'setLineOrPointWidth':
      return {
        ...state,
        lineOrPointWidth: action.payload as number,
      }
    case 'setDrawerOpen':
      return {
        ...state,
        drawerOpen: action.payload as boolean,
      }
    case 'setSelectedColumns':
      return {
        ...state,
        csvFileColum: action.payload as csvFileColum[],
      }
    case 'setFiles':
      return {
        ...state,
        files: action.payload as ProcessFile[],
      }

    case 'setGraftState':
      return {
        ...state,
        ...(action.payload as IGraftState),
      }
    case 'updateFile': {
      const files = state.files.map((file) => {
        if (file.id === (action.payload as ProcessFile).id) {
          return action.payload as ProcessFile
        }
        return file
      })
      return {
        ...state,
        files,
      }
    }
    case 'updateCSVfileColumn': {
      const csvFileColum = state.csvFileColum.map((column) => {
        if (column.id === (action.payload as csvFileColum).id) {
          return action.payload as csvFileColum
        }
        return column
      })
      return {
        ...state,
        csvFileColum,
      }
    }
    case 'setPlatform': {
      return {
        ...state,
        platform: action.payload as 'web' | 'desktop',
      }
    }
    case 'setIsFilesGrouped': {
      return {
        ...state,
        isFilesGrouped: action.payload as boolean,
      }
    }
    case 'setColorScheme': {
      return {
        ...state,
        colorScheme: action.payload as IColorScheme,
      }
    }

    case 'setSelectedFilesCount': {
      return {
        ...state,
        selectedFilesCount: action.payload as number,
      }
    }

    case 'setCalcToUniqueFrequency': {
      return {
        ...state,
        uniqueFrequencyCalc: action.payload as FrequencyValues[],
      }
    }

    case 'setSelectFilesToCalcUniqueFrequency': {
      return {
        ...state,
        concInputValues: action.payload as ConcInputValue[],
      }
    }

    default:
      return state
  }
}
