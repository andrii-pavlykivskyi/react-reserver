import React, { ReactNode, ComponentProps } from 'react'
import { Dimension } from './types'
import { ReserverContent } from './Reserver/types'

function getContent(
  index: number,
  length: number,
  content: ReserverContent,
  firstContent: ReactNode,
  lastContent: ReactNode
): ReactNode {
  if (index === 0) {
    return firstContent || content[index] || <div />
  } else if (length - 1 === index) {
    return lastContent || content[length - 1] || <div />
  }
  return content[index] || <div />
}

type BarProps = ComponentProps<'div'> & {
  length: number
  dimension: Dimension
  firstContent: ReactNode
  lastContent: ReactNode
  content: ((length: number) => ReserverContent) | ReserverContent
}

export default function Bar(props: BarProps) {
  const content =
    typeof props.content === 'function'
      ? props.content(props.length)
      : props.content
  return (
    <div
      id={props.id}
      role='listitem'
      onDragStart={(e) => {
        if (props.onDragStart) props.onDragStart(e, props)
      }}
      onDragEnd={(e) => {
        props.onDragEnd(e, props)
      }}
      onClick={(e) => {
        props.onClick(e, props)
      }}
      onMouseOver={(e) => {
        props.onMouseOver(e, props)
      }}
      onContextMenu={(e) => {
        props.onContextMenu(e, props)
      }}
      onMouseEnter={(e) => {
        props.onMouseEnter(e, props)
      }}
      onMouseLeave={(e) => {
        props.onMouseLeave(e, props)
      }}
      onMouseMove={(e) => {
        props.onMouseMove(e, props)
      }}
      onMouseDown={(e) => {
        props.onMouseDown(e, props)
      }}
      onMouseUp={(e) => {
        props.onMouseUp(e, props)
      }}
      onPointerDown={(e) => {
        typeof props.onPointerDown === 'function' &&
          props.onPointerDown(e, props)
      }}
      draggable={props.draggable}
      style={{
        ...props.style,
        pointerEvents: props.style?.pointerEvents || 'none',
        background: props.style?.background || '#0E6BA8',
        display: props.style?.display || 'flex',
        position: props.style?.position || 'absolute',
        zIndex: props.style?.zIndex || '100'
      }}
      className={props.className}
    >
      {[...Array(props.length)].map((notUsed, i) => {
        const processedContent = getContent(
          i,
          props.length,
          content,
          props.firstContent,
          props.lastContent
        )

        const style = Object.assign(
          {
            width: props.dimension.width,
            height: props.dimension.height,
            pointerEvents: props.style?.pointerEvents || 'none'
          },
          ((processedContent as ReactNode)?.props && processedContent?.props?.style) || {}
        )

        return (
          <React.Fragment key={i}>
            {React.cloneElement(
              processedContent,
              { ...processedContent.props, style },
              processedContent.props.children
            )}
          </React.Fragment>
        )
      })}
      {props.children}
    </div>
  )
}

Bar.defaultProps = {
  style: {},
  dimension: { width: 20, height: 20 },
  onClick: () => {},
  onMouseOver: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  onContextMenu: () => {},
  onMouseDown: () => {},
  onMouseUp: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onMouseMove: () => {},
  length: 1,
  content: {}
}
