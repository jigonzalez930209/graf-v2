import * as React from 'react'
import { GrafContext } from '@/graf/context/GraftContext'
import { IGraftImpedanceType, IGrafType } from '@/graf/interfaces/interfaces'
import { IMPEDANCE_TYPE } from '@/graf/utils/utils'

import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Slider } from '../ui/slider'

export const Settings = () => {
  const {
    graftState: {
      stepBetweenPoints,
      fileType,
      impedanceType,
      lineOrPointWidth,
      graftType,
    },
    setImpedanceType,
    setLineOrPointWidth,
    setStepBetweenPoints,
    setGraftType,
  } = React.useContext(GrafContext)

  return (
    <ul className='one m-0 grid list-none gap-y-[10px] p-[22px] sm:w-[400px]'>
      <li className='grid grid-cols-5 items-center gap-3'>
        <Label className='col-span-2 align-top'>Line type</Label>
        <Select
          onValueChange={(t) => setGraftType(t as IGrafType)}
          value={graftType}
          defaultValue='line'
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select line or scatter type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='line'>Line</SelectItem>
            <SelectItem value='scatter'>Scatter</SelectItem>
          </SelectContent>
        </Select>
      </li>
      <li className='grid grid-cols-5  gap-3'>
        <Label className='col-span-2 align-top'>Width of line or points</Label>
        <Slider
          className='col-span-3 w-full'
          onValueChange={(w) => setLineOrPointWidth(w[0])}
          defaultValue={[3]}
          value={[lineOrPointWidth]}
          max={20}
          min={1}
          step={1}
        />
      </li>
      {fileType === 'teq4' && (
        <li className='grid grid-cols-5  gap-3'>
          <Label className='col-span-2 align-top'>Steps between points</Label>
          <Slider
            className='col-span-3 w-full'
            onValueChange={(s) => setStepBetweenPoints(s[0])}
            defaultValue={[30]}
            value={[stepBetweenPoints]}
            max={30}
            min={1}
            step={1}
          />
        </li>
      )}
      {fileType === 'teq4Z' && (
        <li className='grid grid-cols-5 items-center gap-3'>
          <Label className='col-span-2 align-top'>Impedance type</Label>
          <Select
            onValueChange={(i) => setImpedanceType(i as IGraftImpedanceType)}
            defaultValue={IMPEDANCE_TYPE[1]}
            value={impedanceType}
          >
            <SelectTrigger className='col-span-3'>
              <SelectValue placeholder='Select an Impedance type ' />
            </SelectTrigger>
            <SelectContent
              onChange={(a) => {
                console.log(a)
              }}
            >
              {IMPEDANCE_TYPE.map((item) => (
                <SelectItem key={item} value={item} className='capitalize'>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
      )}
    </ul>
  )
}
