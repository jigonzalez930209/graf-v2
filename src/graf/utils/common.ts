import * as FileSaver from 'file-saver'
import _ from 'lodash'
import XLSX from 'xlsx'

import {
  ConcInputValue,
  FrequencyValues,
  ProcessFile,
} from '../interfaces/interfaces'
import { COLORS } from './utils'

const extractSerialPoint = (
  files:
    | File[]
    | {
        content: string[][]
        name: string
        invariableContent?: string[][]
        selectedInvariableContentIndex: number
        columns: string[]
      }[]
    | any[]
): ProcessFile[] => {
  let processFile: ProcessFile[] = []

  for (let i = 0; i < files.length; i++) {
    const element = files[i]
    if (fileType(element.name) === 'teq4z') {
      const arrayFile = (element.content as string).split(/(?:\r\n|\r|\n)/g)
      const pointNumber = parseInt(arrayFile[105])
      const data = _.slice(arrayFile, 146, 146 + pointNumber)
      const dataPoint: string[][] = data.map((line) => line.split(','))
      const impedance: ProcessFile['impedance'] = {
        V: parseFloat(arrayFile[10].split(',')[1]),
        signalAmplitude: parseFloat(arrayFile[113].split(',')[0]),
        sFrequency: parseFloat(arrayFile[103].split(',')[0]),
        eFrequency: parseFloat(arrayFile[104].split(',')[0]),
        totalPoints: parseInt(arrayFile[105].split(',')[0]),
      }
      processFile.push({
        id: (+new Date() * Math.random()).toString(36).substring(0, 6),
        type: 'teq4Z',
        name: element.name,
        color: COLORS[i],
        pointNumber,
        content: dataPoint,
        selected: false,
        impedance: impedance,
      })
    } else if (fileType(element.name) === 'teq4') {
      const arrayFile = (element.content as string).split(/(?:\r\n|\r|\n)/g)
      const countX = parseInt(arrayFile[23].split(',')[1])
      const countY = parseInt(arrayFile[24].split(',')[1])
      const dataX = _.slice(arrayFile, 146, 146 + countX)
      const dataY = _.slice(arrayFile, 146 + countX, 146 + countX + countY)
      const dataPoint: string[][] = dataX.map((x, index) => [x, dataY[index]])
      const samplesSec = parseInt(arrayFile[27].split(',')[1])
      const range = parseInt(arrayFile[13].split(',')[1])
      const cicles = parseInt(arrayFile[17].split(',')[1])
      const totalTime = countX / samplesSec

      processFile.push({
        id: (+new Date() * Math.random()).toString(36).substring(0, 6),
        color: COLORS[i],
        type: 'teq4',
        name: element.name,
        pointNumber: countX,
        content: dataPoint,
        selected: false,
        voltammeter: {
          samplesSec,
          cicles,
          range,
          totalTime,
        },
      })
    } else if (fileType(element.name) === 'csv') {
      processFile.push({
        id: (+new Date() * Math.random()).toString(36).substring(0, 6),
        color: COLORS[i],
        type: 'csv',
        name: element.name,
        content: files[i].content as string[][],
        selectedInvariableContentIndex: files[i].selectedInvariableContentIndex,
        invariableContent: files[i].invariableContent,
        selected: false,

        csv: { columns: files[i].columns },
      })
    } else if (fileType(element.name) === 'xlsx') {
    } else throw new Error('File type not supported')
  }

  return processFile
}

const fileType = (fileName: string): string => {
  const fileNameParts: String[] = fileName.split('.')
  const fileExtension = fileNameParts[fileNameParts.length - 1]
  if (typeof fileExtension !== 'undefined') return fileExtension.toLowerCase()
  else return null
}

const exportExcelFrequency = ({
  uniqueFrequencyCalc,
  concInputValues,
  fileName,
}: {
  uniqueFrequencyCalc: FrequencyValues[]
  concInputValues: ConcInputValue[]
  fileName: string
}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'
  const fileExtension = '.xlsx'
  const frequency = XLSX.utils.json_to_sheet(
    uniqueFrequencyCalc.map((g, i) => ({
      frequencyLog: g[i].frequency,
      '': '',
      module_slope: g[i].module.m,
      phase_slope: g[i].phase.m,
      zi_slope: g[i].zi.m,
      zr_slope: g[i].zr.m,
      ' ': '',
      'module_R^2': g[i].module.r,
      'phaseR_R^2': g[i].phase.r,
      'zi_R^2': g[i].zi.r,
      'zr_R^2': g[i].zr.r,
      '  ': '',
      module_b: g[i].module.b,
      phase_b: g[i].phase.b,
      zi_b: g[i].zi.b,
      zr_b: g[i].zr.b,
    }))
  )
  const files = XLSX.utils.json_to_sheet(
    concInputValues.map((c) => ({
      file: c.name,
      concentration: c.value,
    }))
  )
  const wb = {
    Sheets: { frequency: frequency, conc: files },
    SheetNames: ['frequency', 'conc'],
  }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(data, fileName + fileExtension)
}

const exportExcelImpedance = () => {
  throw new Error('Not implemented')
}
const exportExcelVoltametry = () => {
  throw new Error('Not Voltametry')
}

export {
  fileType,
  extractSerialPoint,
  exportExcelFrequency,
  exportExcelImpedance,
  exportExcelVoltametry,
}
