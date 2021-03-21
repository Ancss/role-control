
export function isObject(val: Object): val is Object {
  return val !== null && typeof val === 'object'
}
type anyObject = {
  [x in string | number]: anyObject[x]
}
export function deepDeleteKey(data: anyObject, key: keyof typeof data) {
  if (!isObject(data) && !Array.isArray(data)) { return }
  if (data[key]) {
    Reflect.deleteProperty(data, key)
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      deepDeleteKey(item, key)
    })
  }
  Object.keys(data).forEach((k: any) => {
    let item = data[k] as anyObject
    deepDeleteKey(item, key)
  })
  return data
}
