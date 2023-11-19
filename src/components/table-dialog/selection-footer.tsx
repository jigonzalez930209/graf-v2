import React from 'react'
import { MousePointerSquareIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import CustomTooltip from '../ui/tooltip'
import {
  Colors,
  SelectionFooterProps,
  Variables,
} from './import-dialog-interfaces'

const baseColors = {
  module: 'blue' as Colors,
  phase: 'green' as Colors,
  frequency: 'red' as Colors,
}
const Card = ({ onSelect, className, content }) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'm-3 flex h-24 w-full border-spacing-2 cursor-pointer items-center',
        'justify-center gap-2 rounded-md p-2',
        className
      )}
    >
      <div>{content}</div>
      <div></div>
    </div>
  )
}

const SelectionFooter = (props: SelectionFooterProps) => {
  const { selected, handleSelect } = props
  const [open, setOpen] = React.useState(true)
  const [currentSelect, setCurrentSelect] = React.useState<
    'module' | 'phase' | 'frequency'
  >(null)

  const handleSelectChange = (e: Variables) => {
    setCurrentSelect(e)
    handleSelect({ variable: e, color: baseColors[e], active: true })
  }

  return (
    <div className='col-span-5 grid grid-cols-3 '>
      <div className=' flex'>
        Selected initial header row:{' '}
        {selected?.row || (
          <span className='ml-2 uppercase text-red-500'> not selected</span>
        )}
      </div>
      <div className='col-span-2 grid grid-cols-2'>
        {selected?.col ? (
          <div className='col-span-1 grid grid-cols-5 items-center'>
            <Popover open={open}>
              <PopoverTrigger onClick={() => setOpen((prev) => !prev)}>
                <CustomTooltip
                  title='Settings'
                  Icon={<MousePointerSquareIcon className='h-5 w-5' />}
                />
              </PopoverTrigger>
              <PopoverContent className='h-auto w-auto bg-secondary'>
                <div className='flex w-full items-center justify-center gap-5'>
                  Please pick one variable and click on the column to select it.
                </div>
                <ul className='m-0 flex justify-between gap-x-[20px]'>
                  <Card
                    content='Frequency'
                    onSelect={() => handleSelectChange('frequency')}
                    className={cn(
                      'bg-red-200 hover:bg-red-300 ',
                      currentSelect === 'frequency' &&
                        'border-4 border-dotted border-red-700 bg-red-400 text-white shadow-md shadow-red-300 hover:bg-red-500'
                    )}
                  />

                  <Card
                    content='Module'
                    onSelect={() => handleSelectChange('module')}
                    className={cn(
                      'bg-blue-200 hover:bg-blue-300 ',
                      currentSelect === 'module' &&
                        'border-4 border-dotted border-blue-700 bg-blue-400 text-white shadow-md shadow-blue-300 hover:bg-blue-500'
                    )}
                  />

                  <Card
                    content='Phase'
                    onSelect={() => handleSelectChange('phase')}
                    className={cn(
                      'bg-green-200 hover:bg-green-300 ',
                      currentSelect === 'phase' &&
                        'border-4 border-dotted border-green-700 bg-green-400 text-white shadow-md shadow-green-300 hover:bg-green-500'
                    )}
                  />
                </ul>
                <PopoverArrow className='fill-primary' />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          'null'
        )}
      </div>
    </div>
  )
}

export default SelectionFooter
