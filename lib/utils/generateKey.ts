/* eslint-disable @typescript-eslint/no-explicit-any */
import isObject from './isObject'

export default function generateKey(
  param: any,
  level = 0,
  maxLevel = 4
): any {
  if (level === maxLevel) return

  if (Array.isArray(param)) {
    return param.map((elem) => {
      return generateKey(elem, level + 1)
    })
  }

  if (isObject(param)) {
    return Object.keys(param).map((key) => {
      return key + ' : ' + generateKey(param[key], level + 1)
    })
  }
  if (typeof param === 'function') {
    return param.name + 'function'
  }

  if (typeof param === 'string' || typeof param === 'number') {
    return param
  }

  return JSON.stringify(param)
}
