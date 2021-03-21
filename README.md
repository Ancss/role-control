# role-control

这是一个角色权限控制的js库，只提供基本的三个方法，就可以轻松的完全权限控制管理功能

### 如何创建角色成员

首先你先要确定好你的角色关系，可以有多层嵌套关系，但是尽量不要有互相嵌套

首先需要创建这样一个角色关系对象，某个角色如果不拥有其他角色的权限，**只需设置为true即可**

如果像Leader这种角色，需要获取下级角色权限，则需要设置为对象

```javascript
let roles = {
  super: true,

  sales: true,
  salesLeader: {
    includes: ['sales'],
  },

  produce: true,
  produceLeader: {
    includes: ['produce', 'finance']
  },

  skill: true,
  skillLeader: {
    includes: ['skill', 'produceLeader']
  },

  finance: true,

  vicChairman: {
    includes: ['skillLeader'],
    excludes: ['produceLeader'],
    extras: ['finance']
  }
}
```

#### 对象内成员

##### includes

​	填写需要下级成员名单，类型为数组，如上`salesLeader`可以获取`sales`权限

​	同样如上，`skillLeader`也可以获取`produceLeader`的权限，即他可以访问的权限如下

- `skillLeader`
- `skill`
- `produceLeader`
- `produce`

##### excludes

​		如果你想让当前角色获取下级的权限，但是又不想得到更下级的某个权限，那你可以放入`excludes`名单中，他同样是一个数组

​	如上`vicChairman`希望拿到`skillLeader`的权限，但是又不需要`skillLeader`中`produceLeader`，那你可以放入`excludes`中，

​	不过需要注意此时`produceLeader`下的所有权限都将无法获得

##### extras

​	`extras`是额外的意思，他仅仅是作为`includes`中拥有，但又被`excludes`下级中排除，但是又想获取更下级的某个权限，那你就可以使用他

​	**但是希望尽可能的不要使用他！！！**

​	如上`vicChairman`希望拿到`skillLeader`的权限，但是又不需要`skillLeader`中`produceLeader`，可是又需要`produceLeader`下`finance`权限，

​	此时如果你将`finance`放入`includes`中是无效的，他的上级已经在`excludes`中，所以如果你想单独获取他的权限，那你只能放入`extras`中

### 如何使用

#### createRolesMap

本库只暴露该方法，将上面创建好的对象传递给该函数，他会递归创建角色关系图，并返回一个对象，对象内包含两个方法

```javascript
let roleManage = createRolesMap(roles)
console.log(roleManage)//{filterMenus,isConfirm}
```



##### 返回的对象包含的两个方法

###### `filterMenus`

- 将你的routes或其他嵌套的对象中设置`key:__role`,如下

  ```javascript
  let routes = {
    route1: {
      children: [
        {
          name: 'produceLeader--sales',
          __role: ['produceLeader', 'sales']
        },
        {
          name: 'finance',
          __role: 'finance'
        }
      ]

    },
    route2: {
      name: 'produceLeader',
      __role: ['produceLeader']
    },
    route3: {
      name: 'finance',
      __role: ['finance'],
      children: [
        {
          name: 'skillLeader',
          __role: 'skillLeader'
        },
        {
          name: 'skill',
          __role: 'skill'
        }
      ]
    },
  }
  ```

- 此时调用`filterMenus`,传入`routes`，以及当前角色，将会返回根据当前角色过滤的一个新的routes

  ```javascript
   const filterRoutes = roleManage.filterMenus(routes, 'super')
  ```

###### `isConfirm`

​	此时如果你有个需求，一个按钮，需要判断当前角色是否应该展示，你就可以通过`isConfirm`方法来进行判断

- 参数1：当前按钮只在哪些角色中展示，可以是角色名，也可以是一个数组
- 参数2：传入当前的角色，可以是数组或角色名

```javascript
 let sales = roleManage.isConfirm('sales', ['sales', 'salesLeader'])
 let produce = roleManage.isConfirm('produce', ['produce', 'produceLeader'])
 let skill = roleManage.isConfirm('skill', ['skill', 'skillLeader'])
 let vicChairmanAndFinance = roleManage.isConfirm(['produceLeader', 'finance'], 'vicChairman')
```

将参数1和参数2进行逐一比对，只要有一个角色可以通行，那么`isConfirm`返回`true`

比对结束后如果还没有返回`true`，那么就会返回`false`



