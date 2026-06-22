import type { ReactNode } from 'react'
import { containerContentWidths } from './container.schema'
import styles from './Container.module.scss'

type ContainerContentWidth = (typeof containerContentWidths)[number]

function isContainerContentWidth(
  value: string | undefined,
): value is ContainerContentWidth {
  return containerContentWidths.includes(value as ContainerContentWidth)
}

export function Container({
  children,
  contentWidth,
  className,
}: {
  children?: ReactNode
  contentWidth?: string
  className?: string
}) {
  const resolvedContentWidth = isContainerContentWidth(contentWidth)
    ? contentWidth
    : 'boxed'
  const resolvedClassName = className
    ? `${styles.container} ${className}`
    : styles.container

  return (
    <div
      className={resolvedClassName}
      data-container-width={resolvedContentWidth}
    >
      {children}
    </div>
  )
}
