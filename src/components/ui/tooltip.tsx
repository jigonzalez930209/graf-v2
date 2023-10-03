import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

import { Button } from './button'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 20, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export type CustomTooltipProps = {
  title: string
  Icon?: React.ReactNode
  content?: string
  children?: JSX.Element
  onClick?: () => void
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { title, Icon, content, children, onClick } = props
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClick}
            className='rounded-full'
          >
            {!!Icon &&
              React.isValidElement(Icon) &&
              React.cloneElement(Icon as React.ReactElement<any>, {
                className: cn(Icon.props.className || 'h-[16px] w-[16px]'),
              })}
            {children}
          </Button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className='z-50 mt-1 select-none rounded-[4px] border border-slate-500 bg-background px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade'
            sideOffset={5}
          >
            {title && <div className='inline-block font-bold'>{title}</div>}{' '}
            {content && <div className='text-[14px]'>{content}</div>}
            <TooltipPrimitive.Arrow className=' fill-slate-500' />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default CustomTooltip

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
