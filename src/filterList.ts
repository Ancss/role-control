import { rolesMap, Roles, } from './createRolesMap'
import { isConfirm } from './isConfirm'
import { cloneDeep } from 'lodash'
import { isObject } from './utils/index';
export type filterMenus<T = any> = (menu: any, currentRole: (keyof Roles)) => any;
export const filterMenus: filterMenus = (menu, currentRole) => {
  if (!menu || !currentRole) { return menu }
  let deepMenu = cloneDeep(menu)
  eachMenu(deepMenu, currentRole)

  return deepMenu
}
function eachMenu(menu: any, role: (keyof Roles)) {
  if (!isObject(menu) && !Array.isArray(menu)) { return }
  if (Array.isArray(menu)) {
    eachArrayMenu(menu, role)
  }
  let keys = Object.keys(menu)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let item = menu[key]
    eachMenu(item, role)
    if (!item) { return }
    if (item.__role) {
      if (typeof item.__role === 'string') {
        item.__role = [item.__role]
      }
      Reflect.defineProperty(item, '__role', {
        writable: false,
        enumerable: false,
      })
      if (item.__role && !(isConfirm(item.__role, role))) {
        if (Array.isArray(menu)) {
          menu.splice(i, 1)
          i--
        } else {
          Reflect.deleteProperty(menu, key)
        }
      }
    }
  }



}
function eachArrayMenu(menu: any, role: (keyof Roles)) {
  menu.map((item: any) => {
    eachMenu(item, role)
  })
}
