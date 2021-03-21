const { createRolesMap, Roles } = require('../src/createRolesMap.ts')
const { mutilRolesError } = require('../src/genNumbers.ts')
const { role30, role31 } = require('./roleLength.js')

test('test roles length ', () => {
  function test30() {
    createRolesMap(role30)
  }
  function test31() {
    createRolesMap(role31)
  }
  expect(test30).not.toThrowError();
  expect(test31).toThrowError('角色最多为31位,默认包含super管理者');
});
