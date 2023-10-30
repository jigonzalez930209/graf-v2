import * as React from 'react'
import useFrequencyUniquePlotOptions from '@/graf/hooks/useFrequencyUniquePlotOptions'

import Plot from '../plot/new-plot'

const PlotItem = ({ title, dataToGraf }) => {
  const { plotData, plotLayout, plotOptions, handleSetPlotOptions } =
    useFrequencyUniquePlotOptions({
      data: dataToGraf ? dataToGraf : [],
      title: title,
    })

  React.useEffect(() => {
    if (dataToGraf?.length > 0) handleSetPlotOptions()
  }, [dataToGraf])

  return (
    <div className='flex scale-[93%] items-center justify-center'>
      <Plot
        data={plotData}
        config={plotOptions}
        layout={plotLayout}
        exportFileName={title}
        isNeccessaryRefreshZoom
      />
    </div>
  )
}

export default PlotItem
