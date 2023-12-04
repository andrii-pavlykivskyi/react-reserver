import { useState, useEffect } from 'react'

type UseArrFuncArgs<T> = [Array<T> | ((...args: UseArrFuncArgs<T>) => Array<T>)]

export function useArrFunc<T>(...args: UseArrFuncArgs<T>) {
  const [results, setResults] = useState<Array<T>>([])
  useEffect(() => {
    if (Array.isArray(args[0])) {
      setResults(args[0])
    } else if (typeof args[0] === 'function') {
      const func = args.splice(0, 1)
      if (typeof func[0] === 'function') {
        setResults(func[0](...args))
      }
    }
  }, [args])

  return results
}

type UseFunctionArgs = [(...args: unknown[]) => void, ...unknown[]]

export function useFunction(...args: UseFunctionArgs) {
  const [results, setResults] = useState()
  useEffect(() => {
    if (typeof args[0] === 'function') {
      const func = args.splice(0, 1)
      if (typeof func[0] === 'function') {
        setResults(func[0](...args))
      }
    } else {
      throw new Error('useFunction takes first argument as a function')
    }
  }, [args])

  return results
}
