export type Dimension = {
  width: number
  height: number
}

export type Position = {
  left: number
  top: number
}

export type CellCoordinates = { row: number; column: number }

export type BarStick = 'right' | 'left'

export type Bar = {
  editing: boolean
  id: string // maybe its not string
  column: number
  row: number
  stick: BarStick
  length: number
  collisions?: Record<Bar['id'], string>
}
