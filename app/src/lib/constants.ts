export const ENDPOINTS = {
  auth: {
    login: "/api/login",
    register: "/api/register/user",
  },
  lister: {
    getContracts: "/api/contract",
    createContract: "/api/contract",
  },
  bidder: {
    getContracts: "/api/contract/bidder"
  },
}

export const ROUTES = {
  lister: {
    dashboard: "/dashboard/lister",
    stats: "/dashboard/lister/stats",
    listContract: "/dashboard/lister/add",
  },
  auth: {},
  bidder: {},
}
