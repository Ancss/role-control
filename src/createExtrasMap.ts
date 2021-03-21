import { Roles, rolesMap, RoleAuthManage } from './createRolesMap';

export const createExtrasMap = (mutilAuthManage: RoleAuthManage[]) => {
  let map = new Map()
  Object.keys(mutilAuthManage).forEach((key: any) => {
    let authManage = mutilAuthManage[key] as RoleAuthManage
    if (authManage.excludes && authManage.extras) {
      let val = 0
      authManage.extras.forEach(role => {
        let extraRole = rolesMap.get(role)
        let bool = authManage.excludes!.some((item) => rolesMap.get(item) <= extraRole)
        // 如果bool为true，说明extras中有某个数据比excludes大，但是extras里存放的应该都是比较基础的角色
        if (bool) { throw Error(`extras里建议只放入excludes中的子级`) }
        val |= extraRole
      })
      map.set(key, val)
    }
  })
  return map
}
