import { CandlestickChartIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import CustomTooltip from '../ui/tooltip'
import ParameterInput from './parameter-input'
import PlotContainer from './plot-container'

const FrequencyAnalysisDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <CustomTooltip
          title='Frequency Analysis'
          Icon={<CandlestickChartIcon className='h-5 w-5' />}
        />
      </DialogTrigger>
      <DialogContent className='h-[95%] max-w-[95%] gap-0 overflow-y-auto overflow-x-hidden'>
        <DialogHeader className='mb-1 h-6 p-0'>Frequency Analysis</DialogHeader>
        <ParameterInput />
        <div className='h-full overflow-hidden'>
          <PlotContainer />
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default FrequencyAnalysisDialog
