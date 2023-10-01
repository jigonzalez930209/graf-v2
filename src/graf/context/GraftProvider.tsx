import * as React from 'react'

import {
  csvFileColum,
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
  fileType: 'teq4',
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
        updateFile,
        updateCSVfileColumn,
        setGraftState,
        setPlatform,
        setLineOrPointWidth,
      }}
    >
      {children}
    </GrafContext.Provider>
  )
}
