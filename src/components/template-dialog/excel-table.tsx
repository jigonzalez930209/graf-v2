import * as React from 'react'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { textRenderer } from 'handsontable/renderers'
import { GridSettings } from 'handsontable/settings'
import { HyperFormula } from 'hyperformula'
import tinycolor from 'tinycolor2'

import 'handsontable/dist/handsontable.full.min.css'

import { ExcelTableProps } from '@/graf/utils/import-dialog-interfaces'

registerAllModules()

const ExcelTable = ({
  data,
  setData,
  selected,
  setSelected,
  columns,
}: ExcelTableProps) => {
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  })

  const [settings, setSettings] = React.useState<GridSettings>(() => {
    const initialState = {
      data: data,
      height: '75vh',
      width: '92vw',
      licenseKey: 'non-commercial-and-evaluation',
      colHeaders: true,
      rowHeaders: true,
      manualRowResize: true,
      manualColumnResize: true,
      readOnly: true,
      formulas: {
        engine: hyperformulaInstance,
        sheetName: 'Sheet1',
      },
    }

    return initialState
  })

  // TODO: add a button to calculate the formula in next iteration
  // const Calculate = () => {
  //   console.log(settings.data)
  //   const hypP = HyperFormula.buildFromSheets(
  //     {
  //       Sheet1: settings.data.map((i) =>
  //         Object.values(i).map((v) => v as string)
  //       ),
  //     },
  //     { licenseKey: 'internal-use-in-handsontable' }
  //   )
  //   console.log({
  //     hyperformulaInstance: hyperformulaInstance.getAllSheetsValues(),
  //     hypP: hypP.getAllSheetsValues(),
  //   })

  //   settings.data
  //     .map((i) => Object.values(i).map((v) => v as string))
  //     .map((a) => {
  //       console.log(a)
  //       return a
  //     })
  //     .forEach((b) => console.log(hypP.calculateFormula(b[2], 0)))
  // }

  const handleSelection = (row: number, col: number) => {
    if (col < 0) {
      setSelected((prev) => ({ ...prev, row: row + 1 }))
    }
    if (row < 0) {
      setSelected((prev) => ({ ...prev, col: col + 1 }))
    }
  }
  const renderCellColors = (prop) => {
    const color = prop
    return function firstRowRenderer(
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties
    ) {
      textRenderer.apply(this, arguments)
      td.style.fontWeight = 'bold'
      td.style.color = color
      td.style.background = tinycolor(color).lighten(40).toString()
      td.style.textAlign = 'center'
    }
  }

  const hotTableComponent = React.useRef(null)

  const onBeforeHotChange = (changes) => {
    const newData = [...settings.data]

    changes.forEach(([row, column, _, newValue]) => {
      newData[row][column] = newValue
    })
    setData(newData)
  }

  React.useEffect(() => {
    if (data.length) setSettings((prev) => ({ ...prev, data }))
  }, [data])

  return (
    <div className='my-3 h-full overflow-hidden'>
      <div id='example-preview'>
        <HotTable
          ref={hotTableComponent}
          beforeChange={onBeforeHotChange}
          settings={settings}
          afterSelection={handleSelection}
          cells={(row, col) => {
            let cellProperties: any = {}
            if (row === selected?.row - 1) {
              cellProperties.renderer = renderCellColors('gray')
            }
            if (columns?.find((i) => i.col - 1 === col)) {
              cellProperties.renderer = renderCellColors(
                columns?.find((i) => i.col - 1 === col).color
              )
            }
            return cellProperties
          }}
        />
      </div>
    </div>
  )
}

export default ExcelTable
