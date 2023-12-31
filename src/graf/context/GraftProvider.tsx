import * as React from 'react'

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
import { GrafContext } from './GraftContext'
import { graftReducer } from './graftReducer'

export const INITIAL_STATE: IGraftState = {
  notifications: {
    content: [''],
    title: '',
    type: null,
  },
  state: {},
  fileType: null,
  loading: false,
  graftType: 'scatter',
  impedanceType: 'Nyquist',
  stepBetweenPoints: 30,
  lineOrPointWidth: 3,
  drawerOpen: true,
  csvFileColum: [],
  files: [],
  platform: null,
  isFilesGrouped: false,
  colorScheme: '1',
  selectedFilesCount: 0,
  uniqueFrequencyCalc: [],
  concInputValues: [],
}

interface props {
  children: JSX.Element | JSX.Element[]
  initialState: IGraftState
}

export const GraftProvider = ({ children, initialState }: props) => {
  const [graftState, dispatch] = React.useReducer(graftReducer, initialState)

  const setNotification = (notification: INotification) =>
    dispatch({ type: 'setNotification', payload: notification })

  const setSelectedFile = (selectedFileType: IFileType) =>
    dispatch({ type: 'setFileType', payload: selectedFileType })

  const setGraftType = (type: IGrafType) =>
    dispatch({ type: 'setGraftType', payload: type })

  const setImpedanceType = (type: IGraftImpedanceType) =>
    dispatch({ type: 'setImpedanceType', payload: type })

  const setStepBetweenPoints = (step: IStepBetweenPoints) =>
    dispatch({ type: 'setStepBetweenPoints', payload: step })
  const setLineOrPointWidth = (width: number) =>
    dispatch({ type: 'setLineOrPointWidth', payload: width })

  const setDrawerOpen = (open: boolean) =>
    dispatch({ type: 'setDrawerOpen', payload: open })

  const setSelectedColumns = (filesColumns: csvFileColum[]) =>
    dispatch({ type: 'setSelectedColumns', payload: filesColumns })
  const setFiles = (files: ProcessFile[]) =>
    dispatch({ type: 'setFiles', payload: files })
  const setGraftState = (graftState: IGraftState) =>
    dispatch({ type: 'setGraftState', payload: graftState })

  const updateFile = (file: ProcessFile) =>
    dispatch({ type: 'updateFile', payload: file })

  const updateCSVfileColumn = (csvFileColum: csvFileColum) =>
    dispatch({ type: 'updateCSVfileColumn', payload: csvFileColum })

  const setPlatform = (platform: IPlatform) =>
    dispatch({ type: 'setPlatform', payload: platform })
  const setIsFilesGrouped = (isFileGrouped: boolean) =>
    dispatch({ type: 'setIsFilesGrouped', payload: isFileGrouped })

  const setColorScheme = (colorScheme: IColorScheme) =>
    dispatch({ type: 'setColorScheme', payload: colorScheme })

  const setSelectedFilesCount = (count: number) =>
    dispatch({ type: 'setSelectedFilesCount', payload: count })

  const setCalcToUniqueFrequency = (calcToUniqueFrequency: FrequencyValues[]) =>
    dispatch({
      type: 'setCalcToUniqueFrequency',
      payload: calcToUniqueFrequency,
    })

  const setSelectFilesToCalcUniqueFrequency = (input: ConcInputValue[]) =>
    dispatch({
      type: 'setSelectFilesToCalcUniqueFrequency',
      payload: input,
    })

  const setFile = (file: ProcessFile) =>
    dispatch({ type: 'setFile', payload: file })

  const addFiles = (files: ProcessFile[]) =>
    dispatch({ type: 'addFiles', payload: files })

  React.useEffect(() => {
    setGraftState(initialState)
  }, [initialState])

  return (
    <GrafContext.Provider
      value={{
        graftState,
        setNotification,
        setIsFilesGrouped,
        setSelectedFile,
        setGraftType,
        setImpedanceType,
        setStepBetweenPoints,
        setDrawerOpen,
        setSelectedColumns,
        setFiles,
        setFile,
        addFiles,
        updateFile,
        updateCSVfileColumn,
        setGraftState,
        setPlatform,
        setLineOrPointWidth,
        setColorScheme,
        setSelectedFilesCount,
        setCalcToUniqueFrequency,
        setSelectFilesToCalcUniqueFrequency,
      }}
    >
      {children}
    </GrafContext.Provider>
  )
}
