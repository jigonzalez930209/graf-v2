import * as React from 'react'
import _, { set } from 'lodash'

import { GrafContext } from '../context/GraftContext'
import {
  csvFileColum,
  IStepBetweenPoints,
  ProcessFile,
} from '../interfaces/interfaces'

// TODO: refactor this hook in different and more specific hooks to each cain of data
export const useData = () => {
  const {
    graftState,
    setSelectedFile,
    setGraftType,
    setSelectedColumns: setColumns,
    setFiles,
    updateFile,
    updateCSVfileColumn,
    setSelectedFilesCount,
  } = React.useContext(GrafContext)

  const setData = (payload: ProcessFile[]) => {
    setColumns([])
    setSelectedFilesCount(0)
    if (payload?.length > 0) {
      let columns: csvFileColum[] = []
      payload.forEach((file) => {
        if (file.type === 'csv') {
          columns.push({
            id: file.id,
            fileName: file.name,
            selected: file.selected,
            notSelected: file.csv.columns.map((name, index) => ({
              name,
              index,
            })),
            x: [],
            y: [],
            y2: [],
          })
        }
      })
      setColumns(columns)
      setFiles(payload)
    } else {
      setFiles([])
    }
  }

  const updateFileContent = ({
    id,
    newSelectedIndex,
    fileName,
  }: {
    id: string
    fileName: string
    newSelectedIndex: number
  }) => {
    const selectedFile = graftState.files.find((file) => file.id === id)
    const selectedColumn = graftState.csvFileColum.find(
      (c) => c.fileName === fileName
    )

    const notSelected = selectedFile.invariableContent[newSelectedIndex].map(
      (val, index) => ({
        name: val,
        index,
      })
    )

    updateFile({
      ...selectedFile,
      selectedInvariableContentIndex: newSelectedIndex,
      content: _.slice(
        selectedFile.invariableContent,
        newSelectedIndex + 1,
        selectedFile.invariableContent.length
      ),
      csv: { columns: selectedFile.invariableContent[newSelectedIndex] },
    })
    updateCSVfileColumn({
      ...selectedColumn,
      notSelected,
      x: [],
      y: [],
      y2: [],
    })
  }

  const changeSelectedFile = React.useCallback(
    async (id: string) => {
      const file = graftState.files.find((file) => file.id === id)

      if (!Boolean(file)) throw new Error('File not found')

      if (graftState.selectedFilesCount === 10 && file.selected === false)
        throw new Error('You can select only 10 files')

      if (Boolean(file.selected)) {
        await setSelectedFilesCount(graftState.selectedFilesCount - 1)
      } else {
        await setSelectedFilesCount(graftState.selectedFilesCount + 1)
      }

      if (file.type === 'csv') {
        setSelectedFile('csv')
        setSelectedFilesCount(1)
        setFiles(
          graftState.files.map((file) => ({
            ...file,
            selected: file.id === id,
          }))
        )
        setColumns(
          graftState.csvFileColum.map((c) => ({
            ...c,
            selected: c.fileName === file.name,
          }))
        )
      } else if (file.type === graftState.fileType) {
        const files = graftState.files.map((f) =>
          f.id === id
            ? {
                ...f,
                selected: f.selected
                  ? false
                  : `${graftState.selectedFilesCount}`,
              }
            : {
                ...f,
                selected:
                  parseInt(file.selected.toString()) <
                  parseInt(f.selected.toString())
                    ? `${parseInt(f.selected.toString()) - 1}`
                    : f.selected,
              }
        )
        setFiles(files)
      } else {
        setSelectedFile(file.type)
        setFiles(
          graftState.files.map((file) => ({
            ...file,
            selected: file.id === id ? '0' : false,
          }))
        )
      }
    },
    [
      graftState.files,
      graftState.selectedFilesCount,
      graftState.fileType,
      graftState.csvFileColum,
      setSelectedFile,
      setSelectedFilesCount,
      setFiles,
      setColumns,
    ]
  )

  const cleanSelectionFiles = () => {
    setFiles(
      graftState.files.map((file) => ({
        ...file,
        selected: false,
      }))
    )
    setSelectedFilesCount(0)
  }

  const getImpedanceData = () => {
    if (graftState.files === null) {
      return []
    }

    return graftState.files
      .filter((file) => file.selected)
      .sort(
        (a, b) =>
          parseInt(a.selected.toString()) - parseInt(b.selected.toString())
      )
      .map((file) => ({
        ...file,
        content: file.content.map((c) => [
          parseFloat(c[2]) * Math.cos((parseFloat(c[3]) * Math.PI) / 180),
          -parseFloat(c[2]) * Math.sin((parseFloat(c[3]) * Math.PI) / 180),
        ]),
      }))
  }

  const getModuleFace = () => {
    if (graftState.files === null) {
      return null
    }
    const impedanceData = graftState.files
      .filter((file) => file.selected)
      .sort(
        (a, b) =>
          parseInt(a.selected.toString()) - parseInt(b.selected.toString())
      )
      .map((file) => ({
        ...file,
        content: file.content.map((c, i) => ({
          module: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2]),
          },
          face: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[3]),
          },
        })),
      }))

    return impedanceData
  }

  const calculateColumn = (
    key: string,
    value: string[],
    isImpedance: boolean = true
  ) => {
    const calculate = {
      Time: isImpedance ? parseFloat(value[0]) : value[2],
      Frequency: parseFloat(value[1]),
      Module: parseFloat(value[2]),
      Face: parseFloat(value[3]),
      ZR:
        parseFloat(value[2]) * Math.cos((parseFloat(value[3]) * Math.PI) / 180),
      ZI:
        -parseFloat(value[2]) *
        Math.sin((parseFloat(value[3]) * Math.PI) / 180),
      name: '',
      Voltage: value[0],
      Current: value[1],
    }

    return calculate[key]
  }

  const exportImpedanceDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return graftState.files
        ?.filter((f) => f.selected)
        .map((file, i) => {
          return {
            name: file.name,
            value: file.content.map((c) =>
              columns.reduce(
                (acc, curr) => ({
                  ...acc,
                  [`${curr} (${i + 1})`]: calculateColumn(curr, c),
                }),
                {}
              )
            ),
          }
        })
    } else {
      return []
    }
  }

  const exportVoltammeterDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return graftState.files
        ?.filter((f) => f.selected)
        .map((file, i) => {
          return {
            name: file.name,
            value: file.content.map((c, j) =>
              columns.reduce(
                (acc, curr) => ({
                  ...acc,
                  [`${curr} (${i + 1})`]: calculateColumn(
                    curr,
                    [
                      ...c,
                      (
                        ((file.voltammeter.totalTime * 1000) /
                          file.pointNumber) *
                        j
                      ).toString(),
                    ],
                    false
                  ),
                }),
                {}
              )
            ),
          }
        })
    } else {
      return []
    }
  }

  const cleanData = () => {
    setFiles(null)
    setColumns(null)
    setSelectedFile(null)
    setGraftType(null)
  }

  const getVCData = (stepBetweens: IStepBetweenPoints) => {
    if (graftState.files === null) {
      return []
    }
    return graftState.files
      .map((file) => ({ ...file, content: _.dropRight(file.content) }))
      .filter((file) => file.selected)
      .map((file) => ({
        ...file,
        content: file.content
          .filter((_, i) => i % stepBetweens === 0)
          .map((c) => [c[0], c[1]]),
      }))
  }

  const getZIZRvsFrequency = () => {
    if (graftState.files === null) {
      return []
    }
    return graftState.files
      .filter((file) => file.selected)
      .sort(
        (a, b) =>
          parseInt(a.selected.toString()) - parseInt(b.selected.toString())
      )
      .map((file) => ({
        ...file,
        content: file.content.map((c, i) => ({
          Zi: {
            x: Math.log10(parseFloat(c[1])),
            y: -parseFloat(c[2]) * Math.sin((parseFloat(c[3]) * Math.PI) / 180),
          },
          Zr: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2]) * Math.cos((parseFloat(c[3]) * Math.PI) / 180),
          },
        })),
      }))
  }

  const getCSVData = (cols: csvFileColum) => {
    if (graftState.files === null || _.isEmpty(cols)) {
      return []
    }
    const csvData = graftState.files
      .filter((file) => file.selected)
      .find((file) => file.type === 'csv')

    // group columns by axis
    const x = cols?.x
    const y = cols?.y
    const y2 = cols?.y2

    if (_.isEmpty(x) && _.isEmpty(y)) return null

    let currentData

    if (_.isEmpty(x) && _.isEmpty(y)) return null

    currentData = {
      x: x?.map((c) => ({
        ...c,
        content: csvData.content.map((d) => d[c.index]),
      })),
      y: y?.map((c) => ({
        ...c,
        content: csvData.content.map((d) => d[c.index]),
      })),
      y2:
        y2 &&
        y2?.map((c) => ({
          ...c,
          content: csvData.content.map((d) => d[c.index]),
        })),
    }

    return currentData
  }

  return {
    data: graftState?.files,
    updateData: setData,
    cleanData,
    changeSelectedFile,
    getImpedanceData,
    getModuleFace,
    exportImpedanceDataToExcel,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    exportVoltammeterDataToExcel,
    updateFileContent,
    cleanSelectionFiles,
  }
}
