const { createRolesMap, Roles } = require('../src/createRolesMap.ts')
const { routes, roles } = require('./role')
const { filterMenus } = require('../src/filterList');
const { isConfirm } = require('../src/isConfirm');
const { deepDeleteKey } = require('../src/utils/index');
const { cloneDeep } = require('lodash')

let roleManage = null
beforeEach(() => {
  roleManage = createRolesMap(roles)
})
describe('test role authority', () => {
  let route3 = {
    name: 'finance',
    children: [
      {
        name: 'skillLeader',
      },
      {
        name: 'skill',
      }
    ]
  }

  it('test super authority whether all pass', () => {
    const filterRoutes = roleManage.filterMenus(routes, 'super',)
    let data = deepDeleteKey(cloneDeep(routes), '__role')
    expect(filterRoutes).toEqual(data)
  })
  it(`test vicChairman whether pass on skillLeader and an extras finance,
  and not pass on produceLeader,because excludes it`, () => {
    const filterRoutes = roleManage.filterMenus(routes, 'vicChairman',)
    expect(filterRoutes.route1).toEqual({ children: [{ name: 'finance' }] })
    expect(filterRoutes.route2).toBeUndefined()
    expect(filterRoutes.route3).toEqual(route3)
  })

  it(`test produceLeader is can pass on produce authority`, () => {
    const filterRoutes = roleManage.filterMenus(routes, 'produceLeader',)

    expect(filterRoutes.route1).toEqual({
      children: [
        {
          name: 'produceLeader--sales',
        },
        {
          name: 'finance',
        }
      ]
    })
    expect(filterRoutes.route2).toEqual({ name: 'produceLeader', })
    expect(filterRoutes.route3).toEqual({ name: 'finance', children: [] })
  })
})
describe('test isConfirm can get expect', () => {
  it('test base', () => {
    let sales = roleManage.isConfirm('sales', ['sales', 'salesLeader'])
    let produce = roleManage.isConfirm('produce', ['produce', 'produceLeader'])
    let skill = roleManage.isConfirm('skill', ['skill', 'skillLeader'])
    expect(sales).toBeTruthy()
    expect(produce).toBeTruthy()
    expect(skill).toBeTruthy()
  })
  describe('test leader ', () => {
    it('expect true', () => {
      let salesLeader = roleManage.isConfirm('salesLeader', ['sales', 'salesLeader'])
      let produceLeader = roleManage.isConfirm('produceLeader', ['produce', 'produceLeader'])
      let skillLeader = roleManage.isConfirm('skillLeader', ['skill', 'skillLeader'])
      console.log('salesLeader', salesLeader)
      expect(salesLeader).toBeTruthy()
      expect(produceLeader).toBeTruthy()
      expect(skillLeader).toBeTruthy()
    })
    it('expect false', () => {
      let salesLeader = roleManage.isConfirm('salesLeader', ['sales', ''])
      let produceLeader = roleManage.isConfirm('produceLeader', ['produce', ''])
      let skillLeader = roleManage.isConfirm('skillLeader', ['skill', ''])
      expect(salesLeader).not.toBeTruthy()
      expect(produceLeader).not.toBeTruthy()
      expect(skillLeader).not.toBeTruthy()
    })
  })
  it('test multi level nesting', () => {
    let finance = roleManage.isConfirm('finance', ['vicChairman', 'produceLeader', 'skillLeader'])
    let vicChairman = roleManage.isConfirm('produceLeader', 'vicChairman')
    let vicChairmanAndFinance = roleManage.isConfirm(['produceLeader', 'finance'], 'vicChairman')
    expect(finance).toBeTruthy()
    expect(vicChairman).toBeFalsy()
    expect(vicChairmanAndFinance).toBeTruthy()
  })
})
