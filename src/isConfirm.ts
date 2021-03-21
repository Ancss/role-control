import { rolesMap, Roles, extrasMap } from './createRolesMap'

export type isConfirm = (condition: (keyof Roles)[], currentRoles: (keyof Roles | (keyof Roles)[])) => boolean
export const isConfirm: isConfirm = (condition, currentRoles) => {
  if (!Array.isArray(condition)) {
    condition = [condition]
  }
  if (!Array.isArray(currentRoles)) {
    currentRoles = [currentRoles]
  }
  let index = 0
  debugger
  while (index < currentRoles.length) {
    let currentRole = currentRoles[index]
    if (condition.length) {
      for (let i = 0; i < condition.length; i++) {
        let rolesMapValue = rolesMap.get(condition[i])
        let extrasMapValue = extrasMap.get(currentRole)
        let currentRoleValue = rolesMap.get(currentRole)
        if ((rolesMapValue & currentRoleValue) && (rolesMapValue <= currentRoleValue)) {
          return true
        } else {
          if (extrasMapValue && (extrasMapValue >= rolesMapValue) && (extrasMapValue & rolesMapValue)) {
            return true
          }
        }
      }
    }
    index++
  }
  return false
}
