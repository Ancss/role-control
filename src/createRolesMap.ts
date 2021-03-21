import { genNumber } from './genNumbers'
import { filterMenus } from './filterList';
import { isConfirm } from './isConfirm';
import { createExtrasMap } from './createExtrasMap'
import { isObject } from './utils';
import { cloneDeep } from 'lodash'

export type Roles<T = any> = {
  [P in keyof T]: RoleAuthManage<T> | Boolean
}

export type RoleAuthManage<T = unknown> = {
  includes: (keyof Roles<T>)[],
  excludes?: (keyof Roles<T>)[],
  extras?: (keyof Roles<T>)[],
}
export type createRolesMap<T = any> =
  (roles: Roles<T>) => {
    isConfirm: isConfirm, filterMenus: filterMenus
  }

export let rolesMap = new Map()
export let exRoles: Roles;
export let extrasMap: Map<any, number>;
export const createRolesMap: createRolesMap = (roles) => {
  exRoles = cloneDeep(roles)
  if (exRoles.super) {
    rolesMap.set('super', parseInt(Array(31).fill(1).join(''), 2))
    Reflect.deleteProperty(exRoles, 'super')
  }
  let basicAuths: (keyof Roles)[] = []
  let mutilAuths: (keyof Roles)[] = []
  let mutilAuthManage: any = {}
  Object.keys(exRoles).forEach(key => {
    let val = exRoles[key]
    if (val === true) {
      basicAuths.push(key)
    }
    if (isObject(val)) {
      mutilAuths.push(key)
      mutilAuthManage[key] = val
    }
  })
  basicAuths.forEach(key => {
    if (!rolesMap.get(key)) {
      let num = genNumber()
      rolesMap.set(key, num)
    }
  })
  mutilAuths.forEach((key: any) => {
    let val = exRoles[key] as RoleAuthManage
    if (!rolesMap.get(key)) {
      let num = genNumber(val)
      rolesMap.set(key, num)
    }
  })
  extrasMap = createExtrasMap(mutilAuthManage)
  return {
    filterMenus,
    isConfirm,
  }
}



