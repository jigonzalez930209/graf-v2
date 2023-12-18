import * as React from 'react'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { HyperFormula } from 'hyperformula'
import tinycolor from 'tinycolor2'

import 'handsontable/dist/handsontable.full.min.css'

import { TemplateFile } from '@/graf/utils/import-dialog-interfaces'
import { textRenderer } from 'handsontable/renderers'

registerAllModules()

type FileContentProps = {
  data: string[][] | null
  template: TemplateFile | null
}
const FileContent = ({ data, template }: FileContentProps) => {
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  })

  const hotTableComponent = React.useRef(null)

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

  return (
    <div className='my-3 h-full overflow-hidden'>
      {data?.length > 0 && (
        <div id='example-preview'>
          <HotTable
            ref={hotTableComponent}
            settings={{
              height: '37vh',
              width: '35vw',
              licenseKey: 'non-commercial-and-evaluation',
              colHeaders: true,
              rowHeaders: true,
              manualRowResize: true,
              manualColumnResize: true,
              readOnly: true,
              formulas: {
                engine: hyperformulaInstance,
              },
              data,
            }}
            cells={(row, col) => {
              let cellProperties: any = {}
              if (row === template?.template?.row - 1) {
                cellProperties.renderer = renderCellColors('gray')
              }
              if (template?.template?.columns?.find((i) => i.col - 1 === col)) {
                cellProperties.renderer = renderCellColors(
                  template?.template?.columns?.find((i) => i.col - 1 === col)
                    .color
                )
              }
              return cellProperties
            }}
          />
        </div>
      )}
    </div>
  )
}
export default FileContent
