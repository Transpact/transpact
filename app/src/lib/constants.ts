export const ENDPOINTS = {
  auth: {
    login: "/api/login",
    register: "/api/register/user",
  },
  lister: {
    getContracts: "/api/contract",
    createContract: "/api/contract",
    contract: "/api/contract/lister-contract/"
  },
  bidder: {
    contracts: "/api/contract/bidder",
    application: "/api/contract/bidder/application"
  },
  manageFiles: "/api/manage-files",
  uploadFile: "/api/upload",
  onChain: {
    uploadContact: "/api/contract/on-chain/deploy"
  }
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
