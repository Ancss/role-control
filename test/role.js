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
module.exports = {
  roles,
  routes
}
