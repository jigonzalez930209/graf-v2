import * as React from 'react'

import { cn } from '@/lib/utils'

type ListProps = React.PropsWithChildren & {
  className?: string
}

const List = React.forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  const { className, children, ...rest } = props
  return (
    <ul
      ref={ref as React.RefObject<HTMLUListElement>}
      className={cn('flex max-w-[240px] flex-col space-y-3', className)}
      {...rest}
    >
      {children}
    </ul>
  )
})

export default List
