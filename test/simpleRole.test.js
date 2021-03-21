const { createRolesMap, Roles } = require('../src/createRolesMap.ts')
const { routes, roles } = require('./simpleRole')
const { filterMenus } = require('../src/filterList');
const { isConfirm } = require('../src/isConfirm');


describe('test simple role', () => {
  let roleManage = null
  beforeEach(() => {
    roleManage = createRolesMap(roles)
  })

  it('test invoke createRolesMap return Functions', () => {
    const returnFns = jest.fn()
    returnFns.mockImplementation(() => ({
      filterMenus: filterMenus,
      isConfirm: isConfirm
    }))
    expect(returnFns()).toEqual(roleManage)
  })

  test('test pass on empty parameter', () => {
    const filterRoutes = roleManage.filterMenus(routes, '',)

    expect(filterRoutes).toBe(routes)
  })
  test('test pass on error parameter', () => {
    const filterRoutes = roleManage.filterMenus(routes, 'sss',)

    expect(filterRoutes.route1).toEqual({ children: [] })
    expect(filterRoutes.route2).toBeUndefined()
    expect(filterRoutes.route3).toBeUndefined()
  })
  describe('test invoke filterMenus by pass on parameter , return Object equal expect', () => {
    let route3 = null
    beforeEach(() => {
      route3 = {
        name: 'skill--finance',
        children: [
          {
            name: 'skillLeader',
          },
          {
            name: 'skill',
          }
        ]
      }
    })
    it('test invoke filterMenus by pass on skillLeader role, return Object equal expect', () => {
      const filterRoutes = roleManage.filterMenus(routes, 'skillLeader',)

      expect(filterRoutes.route1).toEqual({ children: [] })
      expect(filterRoutes.route2).toBeUndefined()
      expect(filterRoutes.route3).toEqual(route3)
    })


    it('test invoke filterMenus by pass on skill role, return Object equal expect', () => {
      const filterRoutes2 = roleManage.filterMenus(routes, 'skill',)
      route3.children.splice(0, 1)

      expect(filterRoutes2.route1).toEqual({ children: [] })
      expect(filterRoutes2.route2).toBeUndefined()
      expect(filterRoutes2.route3).toEqual(route3)
    })
  })

})
