let index = 0
let errorCount = 0

export let mutilRolesError = () => { throw new Error('角色最多为31位,默认包含super管理者') }
import { rolesMap, RoleAuthManage, exRoles, Roles } from './createRolesMap';
export function genNumber(roleAuth?: RoleAuthManage): number {
  errorCount++
  if (errorCount >= 100) {
    throw Error('是否互相引用角色，导致递归爆栈')
  }
  if (index >= 30) {
    mutilRolesError()
  }
  if (roleAuth && roleAuth.includes) {

    roleAuth.includes.forEach((key: string) => {
      let bool = rolesMap.has(key)
      if (!bool) {
        let val = exRoles[key] as RoleAuthManage
        let num = genNumber(val)
        rolesMap.set(key, num)
      }
    })
    if (roleAuth.excludes) {
      roleAuth.excludes.forEach((key: string) => {
        if (!rolesMap.has(key)) {
          let val = exRoles[key] as RoleAuthManage
          let num = genNumber(val)
          rolesMap.set(key, num)
        }
      })
    }
  }

  let val = 1 << index++
  val = setRoleAuthValue(roleAuth!, val)
  return val
}

function setRoleAuthValue(roleAuth: RoleAuthManage, val: number): number {
  if (roleAuth) {
    validArrayInterKey(roleAuth)
    if (roleAuth.includes) {
      roleAuth.includes.forEach(key => {
        let getMapVal = rolesMap.get(key)
        if (!getMapVal) {
          console.error(`includes没有拿到key:${key}的值`)
        } else {
          val |= getMapVal
        }
      })
    }
    if (roleAuth.excludes) {
      validExcludeInternalKeys(roleAuth)
      roleAuth.excludes.forEach(key => {
        let mapVal = rolesMap.get(key)
        if (!mapVal) {
          console.error(`excludes没有拿到key:${key}的值`)
        } else {
          val = smoothOne(mapVal, val)
        }
      })
    }
  }

  return val
}
function validArrayInterKey(roleAuth: RoleAuthManage) {
  if (roleAuth.includes && roleAuth.excludes) {
    roleAuth.includes.forEach(key => {
      if (roleAuth.excludes!.includes(key)) {
        console.error(`includes与excludes中包含相同参数,这可能导致计算数值不正确`)
      }
    })
  }
}

//将mapVal转换成二进制，上面所有1在roleAuth对应位置改为0
function smoothOne(mapVal: number, val: number) {
  let mapValBinary: string[] = mapVal.toString(2).split('')
  let valBinary = val.toString(2).split('')

  let len = valBinary.length - mapValBinary.length
  mapValBinary.unshift(...Array(len).fill("0"))
  for (let i = 0; i < valBinary.length; i++) {
    if (mapValBinary[i] === "1") {
      valBinary[i] = "0"
    }
  }
  return parseInt(valBinary.join(''), 2)
}
// 检验includes的角色内部是否又有下级角色在excludes中
function validExcludeInternalKeys(RoleAuth: RoleAuthManage) {
  if (RoleAuth.excludes) {
    let len = RoleAuth.excludes.length
    for (let i = 0; i < len; i++) {
      let j = 0
      let inRoleKey = RoleAuth.includes[j]
      let exRoleKey = RoleAuth.excludes[i]
      while (inRoleKey) {
        let inMapVal = rolesMap.get(inRoleKey)
        let exMapVal = rolesMap.get(exRoleKey)
        if (exMapVal > inMapVal && exMapVal & inMapVal) {
          console.error(`${exRoleKey}下级包含${inRoleKey},如果你想排除${exRoleKey},但又想将${inRoleKey}包含，建议放入extras数组中，否则${inRoleKey}将无法生效！！！`)
        }
        inRoleKey = RoleAuth.includes[++j]
      }
    }
  }


}
