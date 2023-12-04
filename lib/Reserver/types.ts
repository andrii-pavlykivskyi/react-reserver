import { ReactNode } from "react"
import { Dimension } from "../types"
import { CellEventHandler } from "../Cell"

export type ReserverContent = Record<`r${number}c${number}`, ReactNode>

export type GetReserverContent = (
  columnCount: number,
  rowCount: number
) => ReserverContent

type Title = ((count: number) => React.ReactNode) | ReactNode

export type ChildrenProps = {
  rowCount: number
  columnCount: number
  rowTitleWidth: number
  dimension: Dimension
  columnTitleHeight: number
}


// dimension = { height: 20, width: 20 },
// height = 500,
// width = 500,

// columnTitles: getColumnTitles = [],
// rowTitles: getRowTitles = [],
// content: getContent = (() => ({})) as GetReserverContent,
// rowTitleWidth = 0,
// columnTitleHeight = 0,
// dir = 'ltr',


export type ReserverProps = Omit<React.ComponentProps<'div'>, 'content'> & {
  content?: GetReserverContent
  dimension: Dimension
  height: number
  width: number
  rowTitleWidth: number
  rowTitles: Title[]
  columnTitles: Title[]
  columnTitleHeight: number
  columnTitleClassName?: string
  cantonClassName?: string
  rowTitleClassName?: string
  cellClassName?: string

  mouseDownCell: CellEventHandler
  mouseEnterCell: CellEventHandler
  mouseUpCell: CellEventHandler
  mouseDropCell: CellEventHandler
  mouseDragOverCell: CellEventHandler
  pointerDownCell: CellEventHandler
  pointerMoveCell: CellEventHandler
  pointerEnterCell: CellEventHandler
  pointerLeaveCell: CellEventHandler
  pointerUpCell: CellEventHandler
  pointerOverCell: CellEventHandler

  children: (props: ChildrenProps) => ReactNode
}