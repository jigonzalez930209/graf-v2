import React from 'react'
import { GrafContext } from '@/graf/context/GraftContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import FileSort from '../file-sort'
import { Button } from '../ui/button'

export type DrawerProps = {
  variant: 'left' | 'right' | 'top' | 'bottom'
}

const Drawer = ({ ...props }: DrawerProps) => {
  const {
    graftState: { drawerOpen },
    setDrawerOpen,
  } = React.useContext(GrafContext)
  return (
    <div className='z-0 mr-2 flex max-h-[calc(90vh-3rem)] '>
      <div className={cn(!drawerOpen && 'hidden', 'max-w-[240px]')}>
        <FileSort />
      </div>
      <Button
        variant='ghost'
        size='icon'
        className=' inline-flex h-full w-[10px] cursor-pointer items-center  justify-center rounded-l  hover:bg-gradient-to-l hover:from-primary hover:via-secondary hover:to-secondary'
        asChild
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? (
          <ChevronLeft className='h-[15px] w-[15px] text-primary' />
        ) : (
          <ChevronRight className='h-[15px] w-[15px] text-primary' />
        )}
      </Button>
    </div>
  )
}

export default Drawer
