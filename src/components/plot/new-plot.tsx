import * as React from 'react'
import Plotly from 'react-plotly.js'

type PlotProps = {
  data: any[]
  layout: any
  config: any
  exportFileName: string
  isNeccessaryRefreshZoom: boolean
}

const Plot = (props: PlotProps) => {
  const { data, layout, config, exportFileName, isNeccessaryRefreshZoom } =
    props

  const [zoomState, setZoomState] = React.useState<{
    xRange: number[]
    yRange: number[]
    y1Range?: number[]
  }>(null)

  React.useEffect(() => {
    setZoomState(null)
  }, [isNeccessaryRefreshZoom])

  // console.log({ data, layout, config, exportFileName, isNeccessaryRefreshZoom })

  return (
    <div
      className=''
      id={exportFileName}
      style={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        margin: 'auto',
        padding: '0',
        objectFit: 'cover',
      }}
    >
      <Plotly
        divId={exportFileName}
        data={data}
        layout={{
          ...layout,
          autosize: true,
          margin: {
            autoexpand: true,
            automargin: true,
            l: 50,
            r: 65,
            t: 40,
            b: 75,
            pad: 0,
          },
          xaxis: {
            ...layout.xaxis,
            range: zoomState?.xRange,
          },
          yaxis: {
            ...layout.yaxis,
            range: zoomState?.yRange,
          },
          ...(layout?.yaxis2 && {
            yaxis2: {
              ...layout.yaxis2,
              range: zoomState?.y1Range,
            },
          }),
        }}
        config={{
          scrollZoom: true,
          editable: true,
          // responsive: true,
          // displayModeBar: true,
          toImageButtonOptions: {
            format: 'svg', // one of png, svg, jpeg, webp
            filename: exportFileName || 'graft',
            // height: 750,
            // width: 1050,
            scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
          },
        }}
        onRelayout={(e) => {
          if (typeof e['xaxis.range[0]'] === 'number') {
            setZoomState({
              xRange: [e['xaxis.range[0]'], e['xaxis.range[1]']],
              yRange: [e['yaxis.range[0]'], e['yaxis.range[1]']],
              ...(e['yaxis2.range[0]'] && {
                y1Range: [e['yaxis2.range[0]'], e['yaxis2.range[1]']],
              }),
            })
          } else {
            setZoomState(null)
          }
        }}
        useResizeHandler
      />
    </div>
  )
}

export default Plot
