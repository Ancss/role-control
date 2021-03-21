let roles = {
  super: true,

  sales: true,
  salesLeader: {
    includes: ['sales'],
  },

  produce: true,
  produceLeader: {
    includes: ['produce']
  },

  skill: true,
  skillLeader: {
    includes: ['skill']
  },

  finance: true,

}

let routes = {
  route1: {
    children: [
      {
        name: 'produceLeader--finance',
        __role: ['produceLeader', 'finance']
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
    name: 'skill--finance',
    __role: ['skill', 'finance'],
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
module.exports = {
  roles,
  routes
}
