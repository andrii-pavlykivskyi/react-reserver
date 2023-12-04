import { useEffect, useState } from 'react'
import isObject from '../utils/isObject'
import { Dimension } from '../types'

export default function useDimension(item: number | Dimension) {
  const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof item === 'number') {
      setDimension({ width: item, height: item })
    } else if (isObject(item)) {
      setDimension(item)
    } else {
      setDimension({ width: -1, height: -1 })
    }
  }, [item])

  return dimension
}
