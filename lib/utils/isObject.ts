// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null
}
