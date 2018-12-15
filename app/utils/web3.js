import Web3 from 'web3'

const web3 = new Web3(WEB3_PROVIDER_URL)
const web3metamask = window.dexon ? new Web3(window.dexon) : null

export {
  web3,
  web3metamask
}