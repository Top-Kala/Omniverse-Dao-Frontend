import {BigNumber, BigNumberish, ethers} from 'ethers'
import OmnixBridge from '../constants/addresses/OmnixBridge.json'
import OmnixBridge1155 from '../constants/addresses/OmnixBridge1155.json'
import OmnixExchange from '../constants/OmnixExchange.json'
import Strategy from '../constants/Strategy.json'
import TransferSelectorNFT from '../constants/TransferSelectorNFT.json'
import FundManager from '../constants/FundManager.json'
import OFT from '../constants/OFT.json'
import USDC from '../constants/USDC.json'
import USDT from '../constants/USDT.json'
import Stargate from '../constants/Stargate.json'
import StargatePoolManager from '../constants/StargatePoolManager.json'
import CurrencyManager from '../constants/CurrencyManager.json'
import LZEndpoint from '../constants/layerzero/LayerzeroEndpoints.json'
import ChainIds from '../constants/layerzero/chainIds.json'
import CHAINS from '../constants/chains.json'
import { ChainIds as ChainIDS } from '../types/enum'
import { Network } from "alchemy-sdk"

const omnixBridge: any = OmnixBridge
const omnixBridge1155: any = OmnixBridge1155
const omnixExchange: any = OmnixExchange
const strategy: any = Strategy
const transferSelectorNFT: any = TransferSelectorNFT
const fundManager: any = FundManager
const oft: any = OFT
const usdc: any = USDC
const usdt: any = USDT
const stargate: any = Stargate
const stargatePoolManager: any = StargatePoolManager
const currencyManager: any = CurrencyManager
const lzEndpoint: any = LZEndpoint
const chainIds: any = ChainIds

export const PROTOCAL_FEE = 2
export const CREATOR_FEE = 2

const SUPPORTED_CHAIN_IDS = [5, 56, 137, 43114, 250, 10, 42161, 5, 97, 43113, 80001, 421613, 420, 4002]

export const CURRENCIES_LIST = [
  { value: 0, text: 'OMNI', decimals: 18, icon: 'payment/omni.png' },
  { value: 1, text: 'USDC', decimals: 6, icon: 'payment/usdc.png' },
  { value: 2, text: 'USDT', decimals: 6, icon: 'payment/usdt.png' },
]

export type ContractName =
  'Omnix' |
  'Omnix1155' |
  'LayerZeroEndpoint' |
  'OmnixExchange' |
  'Strategy' |
  'OMNI' |
  'USDC' |
  'USDT' |
  'TransferSelectorNFT' |
  'FundManager' |
  'StargateRouter' |
  'StargatePoolManager' |
  'CurrencyManager'

const environments: any = {
  mainnet: ['ethereum', 'bsc', 'avalanche', 'polygon', 'arbitrum', 'optimism', 'fantom'],
  testnet: ['rinkeby', 'bsc testnet', 'fuji', 'mumbai', 'arbitrum-rinkeby', 'optimism-kovan', 'fantom-testnet']
}

export const rpcProviders: { [key: number]: string } = {
  1:'https://mainnet.infura.io/v3/20504cdcff23477c9ed314d042d85a74',
  56:'https://bsc-dataseed.binance.org/',
  137:'https://polygon-rpc.com',
  43114:'https://api.avax.network/ext/bc/C/rpc',
  250:'https://rpcapi.fantom.network',
  10:'https://mainnet.optimism.io',
  42161:'https://arb1.arbitrum.io/rpc',
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  43113: 'https://api.avax-test.network/ext/bc/C/rpc',
  80001: 'https://polygon-mumbai.g.alchemy.com/v2/H2EfIYrKg--DbTdHW37WJaSVuaJvTF0T',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  421613: 'https://goerli-rollup.arbitrum.io/rpc',
  69: 'https://kovan.optimism.io',
  420: 'https://goerli.optimism.io',
  4002: 'https://rpc.testnet.fantom.network'
}

export const ONFT_CORE_INTERFACE_ID = '0x7bb0080b'
export const ONFT1155_CORE_INTERFACE_ID = '0x33577776'
export const ERC1155_INTERFACE_ID = '0xd9b67a26'
export const ERC712_INTERFACE_ID = '0x80ac58cd'
export const ERC2189_INTERFACE_ID = '0x2a55205a'

export const NETWORK_TYPE : {[key:number]:string} = {
  5 : 'goerli',
  97: 'bsc testnet',
  80001: 'mumbai',
  43113 : 'avalanche testnet',
  420 : 'optimism',
  421613 :'arbitrum',
  4002 : 'fantom-testnet',
}


export const getChainIcons = (chainId: number) => {
  if (SUPPORTED_CHAIN_IDS.includes(chainId)) {
    return {
      icon: chainInfos[chainId].roundedLogo,
      explorer: chainInfos[chainId].explorerLogo,
    }
  }
  return {
    icon: chainInfos[1].roundedLogo,
    explorer: chainInfos[1].explorerLogo,
  }
}

export const chainInfos: { [key: number]: { name: string; logo: string, roundedLogo: string, explorerLogo: string, officialName: string, currency: string } } = {
  1: {
    name: 'eth',
    logo: '/svgs/ethereum.svg',
    roundedLogo: '/images/roundedColorEthereum.png',
    explorerLogo: '/images/ethereumExplorer.png',
    officialName: 'Ethereum',
    currency: 'ETH'
  },
  56: {
    name: 'bsc',
    logo: '/svgs/binance.svg',
    roundedLogo: '/images/roundedColorBinance.png',
    explorerLogo: '/images/binanceExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  137: {
    name: 'polygon',
    logo: '/svgs/polygon.svg',
    roundedLogo: '/images/roundedColorPolygon.png',
    explorerLogo: '/images/polygonExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  43114: {
    name: 'avalanche',
    logo: '/svgs/avax.svg',
    roundedLogo: '/images/roundedColorAvalanche.png',
    explorerLogo: '/images/avalancheExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  250: {
    name: 'fantom',
    logo: '/svgs/fantom.svg',
    roundedLogo: '/images/roundedColorFantom.png',
    explorerLogo: '/images/fantomExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  10: {
    name: 'optimism',
    logo: '/svgs/optimism.svg',
    roundedLogo: '/images/roundedColorOptimism.png',
    explorerLogo: '/images/optimismExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  42161: {
    name: 'arbitrum',
    logo: '/svgs/arbitrum.svg',
    roundedLogo: '/images/roundedColorArbitrum.png',
    explorerLogo: '/images/arbitrumExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  5: {
    name: 'goerli',
    logo: '/svgs/ethereum.svg',
    roundedLogo: '/images/roundedColorEthereum.png',
    explorerLogo: '/images/ethereumExplorer.png',
    officialName: 'Goerli',
    currency: 'GoerliETH'
  },
  97: {
    name: 'bsc testnet',
    logo: '/svgs/binance.svg',
    roundedLogo: '/images/roundedColorBinance.png',
    explorerLogo: '/images/binanceExplorer.png',
    officialName: 'BSC',
    currency: 'BNB'
  },
  43113: {
    name: 'fuji',
    logo: '/svgs/avax.svg',
    roundedLogo: '/images/roundedColorAvalanche.png',
    explorerLogo: '/images/avalancheExplorer.png',
    officialName: 'Fuji',
    currency: 'AVAX'
  },
  80001: {
    name: 'mumbai',
    logo: '/svgs/polygon.svg',
    roundedLogo: '/images/roundedColorPolygon.png',
    explorerLogo: '/images/polygonExplorer.png',
    officialName: 'Mumbai',
    currency: 'MATIC'
  },
  421613: {
    name: 'arbitrum-goerli',
    logo: '/svgs/arbitrum.svg',
    roundedLogo: '/images/roundedColorArbitrum.png',
    explorerLogo: '/images/arbitrumExplorer.png',
    officialName: 'Arbitrum',
    currency: 'ArbETH'
  },
  420: {
    name: 'optimism-goerli',
    logo: '/svgs/optimism.svg',
    roundedLogo: '/images/roundedColorOptimism.png',
    explorerLogo: '/images/optimismExplorer.png',
    officialName: 'Optimism',
    currency: 'ETH'
  },
  4002: {
    name: 'fantom-testnet',
    logo: '/svgs/fantom.svg',
    roundedLogo: '/images/roundedColorFantom.png',
    explorerLogo: '/images/fantomExplorer.png',
    officialName: 'Fantom',
    currency: 'FTM'
  },
}

export const getLayerzeroChainId = (chainId: number): number => {
  return chainIds[chainInfos[chainId].name]
}

export const chainList = [
  { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs', disabled: false},
  { chain: 'goerli', img_url: '/svgs/ethereum.svg', title: 'Ethereum', disabled: false},
  { chain: 'bsc testnet', img_url: '/svgs/binance.svg', title: 'BNB Chain', disabled: false},
  { chain: 'avalanche testnet', img_url: '/svgs/avax.svg', title: 'Avalanche', disabled: false},
  { chain: 'mumbai', img_url: '/svgs/polygon.svg', title: 'Polygon', disabled: false},
  { chain: 'arbitrum', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum', disabled: false},
  { chain: 'optimism', img_url: '/svgs/optimism.svg', title: 'Optimism', disabled: false},
  { chain: 'fantom', img_url: '/svgs/fantom.svg', title: 'Fantom', disabled: false},
]


export const currencies_list: { [key: number]: Array<{ value: number; text: string, icon: string, address: string }> } = {
  1: [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  56: [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  137:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  43114:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  250:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  10:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  42161:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  4:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xE9956C00aaeCa65C89F4C9AcDEbd36A1784F0B86' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  5:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x918460AE47177f1Ce471a384f1a5768b6e443138' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  97:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xBfB4D3441f190014C5111f566e6AbE8a93E862D8' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0xF49E250aEB5abDf660d643583AdFd0be41464EfD' },
  ],
  43113:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x417456563aF8e98d8ddF2915750E72Fa23C8224F' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x4A0D1092E9df255cf95D72834Ea9255132782318' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  80001:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x48894014441Aaf5015EF52a9eC49e147f965cB8b' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  421611:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1EA8Fb2F671620767f41559b663b86B1365BBc3d' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  69:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x567f39d9e6d02078F357658f498F80eF087059aa' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  4002:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x076488D244A73DA4Fa843f5A8Cd91F655CA81a1e' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
}

export const chain_list: {[key: string]: number} = {
  'eth': 1,
  'bsc': 56,
  'matic': 137,
  'avalanche': 43114,
  'fantom': 250,
  'optimism': 10,
  'arbitrum': 42161,
  'bsc testnet': 97,
  'rinkeby': 4,
  'goerli': 5,
  'mumbai': 80001,
  'avalanche testnet': 43113,
  'arbitrum-rinkeby': 421611,
  'arbitrum-goerli': 421613,
  'optimism-kovan': 69,
  'optimism-goerli': 420,
  'fantom-testnet': 4002,
}

export const getChainIdFromName = (name: string): number => {
  return chain_list[name]
}

export const supportChainIDs = [5,80001,43113,421613,420,4002,97]


export const chain_list_: {[key: number]: string} = {
  1 : 'eth ',
  56 : 'bsc',
  137 : 'matic',
  43114 : 'avalanche',
  250 : 'fantom',
  10 : 'optimism',
  42161 : 'arbitrum',
  97 : 'bsc testnet',
  4 : 'rinkeby',
  5: 'goerli',
  80001 : 'mumbai',
  43113 : 'avalanche testnet',
  421611:'arbitrum-rinkeby',
  69:'optimism-kovan',
  4002:'fantom-testnet',
  420 : 'optimism-goerli',
  421613 :'arbitrum-goerli'
}


export const getChainNameFromId = (id: number): string => {
  return chain_list_[id]
}

export const getAddressByName = (name: ContractName, chainId: number) => {
  if (name === 'Omnix') {
    return omnixBridge[chainInfos[chainId].name]
  } else if (name === 'Omnix1155') {
    return omnixBridge1155[chainInfos[chainId].name]
  } else if (name === 'LayerZeroEndpoint') {
    return lzEndpoint[chainInfos[chainId].name]
  } else if (name === 'OmnixExchange') {
    return omnixExchange[chainInfos[chainId].name]
  } else if (name === 'Strategy') {
    return strategy[chainInfos[chainId].name]
  } else if (name === 'OMNI') {
    return oft[chainInfos[chainId].name]
  } else if (name === 'USDC') {
    return usdc[chainId.toString()]
  } else if (name === 'USDT') {
    return usdt[chainId.toString()]
  } else if (name === 'TransferSelectorNFT') {
    return transferSelectorNFT[chainInfos[chainId].name]
  } else if (name === 'FundManager') {
    return fundManager[chainInfos[chainId].name]
  } else if (name === 'StargateRouter') {
    return stargate[chainInfos[chainId].name].router
  } else if (name === 'StargatePoolManager') {
    return stargatePoolManager[chainInfos[chainId].name]
  } else if (name === 'CurrencyManager') {
    return currencyManager[chainId.toString()]
  }
}

export const getProvider = (chainId: number) => {
  const rpcURL = rpcProviders[chainId]
  return new ethers.providers.JsonRpcProvider(
    rpcURL,
    {
      name: chainInfos[chainId].name,
      chainId: chainId,
    }
  )
}

export const getChainInfo = (chainId: number) => {
  const filter = CHAINS.filter((item) => item.chainId === chainId)
  if (filter.length > 0) {
    return filter[0]
  }
  return null
}

const loopCurrencies = (currencies: any, idx: number, address?: string) => {
  if (Object.values(currencies).indexOf(address) != -1) {
    return CURRENCIES_LIST[idx]
  }
  return null
}

export const getCurrencyIconByAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const currency = loopCurrencies(currency_addr_list[idx], idx, address)
    if (currency) {
      return `/images/${currency.icon}`
    }
  }

  return `/images/${CURRENCIES_LIST[0].icon}`
}


export const getCurrencyNameAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const currency = loopCurrencies(currency_addr_list[idx], idx, address)
    if (currency) {
      return currency.text
    }
  }

  return CURRENCIES_LIST[0].text
}

const DECIMAL_MAP = (CURRENCIES_LIST.reduce((acc, c) => {
  (acc as any)[c.text] = c.decimals
  return acc
}, {})) as any

export const formatCurrency = (price: BigNumberish, currencyName: string) => {
  if (price) return ethers.utils.formatUnits(price, DECIMAL_MAP[currencyName])
  return '0'
}

export const parseCurrency = (price: string, currencyName: string) => {
  if (price) return ethers.utils.parseUnits(price, DECIMAL_MAP[currencyName])
  return BigNumber.from(0)
}

const chainIcons = Object.values(chainInfos).reduce((acc, cur) => {
  Object.assign(acc, { [cur.name]: cur.logo} )
  return acc
}, {})

export const getChainIconByCurrencyAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]

  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const chainIdx = Object.values(currency_addr_list[idx]).indexOf(address)
    if (chainIdx != -1) {
      const chainName = Object.keys(currency_addr_list[idx])[chainIdx]
      return (chainIcons as any)[chainName]
    }
  }

  return (chainIcons as any)['rinkeby']
}

export const isUsdcOrUsdt = (address?: string) => {
  const currency_addr_list = [usdc, usdt]

  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const chainIdx = Object.values(currency_addr_list[idx]).indexOf(address)
    if (chainIdx != -1) {
      return true
    }
  }

  return false
}

export const validateCurrencyName = (currencyName: ContractName, chainId: number) => {
  if (chainId === ChainIds.bsc || chainId == ChainIds['bsc testnet']) {
    if (currencyName === 'USDC')
      return 'USDT'
  }
  else {
    if (currencyName === 'USDT')
      return 'USDC'
  }
  return 'OMNI'
}

export const getProfileLink = (chain_id: number, ownerType: string, owner: string) => {
  if(ownerType=='address'){
    const explorer_link = getBlockExplorer(chain_id)
    return (explorer_link+'/address/'+owner)
  }
  return ''
}

export const getChainIcon = (chain: string) => {
  if (chain === 'bsc-testnet')
    return (chainIcons as any)['bsc testnet']
  return (chainIcons as any)[chain]
}

export const getChainIconById = (chainId?: string) => {
  return chainId && chainInfos[Number(chainId)]?.logo
}

export const getCollectionAddress = (col_addresses: any, chain_id: number) => {
  if(col_addresses){
    return col_addresses[chain_id.toString()]
  }
  return null
}

export const getBlockExplorer = (chainId: number) => {
  const chainInfo = getChainInfo(chainId)
  if (chainInfo) {
    return chainInfo.explorers?.[0]?.url
  }
  return null
}
export const isSupportedOnMoralis = (chainId: number) : boolean => {  
  return supportedChainsOnMoralis.includes(chainId)
}
export const isSupportedOnAlchemy = (chainId: number) : boolean => {  
  return supportedChainsOnAlchemy.includes(chainId)
}
export const APIkeysForAlchemy:{[key:number]:string} = {
  420:'fOwhgLzJfvGdNS-3lSaj2Sc8wIIeoR-Q',
  421613:'iSGCCiweawjOPFX-x5Btptlsg4gBLmG9',
  5:'GiAm8CDGn_xhxD18nV4Wunc332XKeZ2w'
}
export const NetworksForAlchemy:{[key:number]:Network} = {
  420: Network.OPT_GOERLI,
  421613:Network.ARB_GOERLI,
  5:Network.ETH_GOERLI
}
export const getAPIkeyForAlchemy = (key:number):string =>{
 return APIkeysForAlchemy[key]
}
export const getNetworForAlchemy = (key:number):Network =>{
  return NetworksForAlchemy[key]
}
export const supportedChainsOnMoralis:Array<number> = [
  80001,
  97,
  43113
]
export const supportedChainsOnAlchemy: Array<number> = [
  420,
  5,
  421613
]

export const findCollection = (addresses:any,nft:any,token_id:string)=>{
  const chain_id = nft.chain_id
  const collection_address = addresses[chain_id]
  return [collection_address,chain_id]
}

export const getValidCurrencies = (chainId: number) => {
  if (chainId === ChainIDS.BINANCE) {
    return [CURRENCIES_LIST[0], CURRENCIES_LIST[2]]
  }

  return [CURRENCIES_LIST[0], CURRENCIES_LIST[1]]
}

export const  base_nft = {
  _id:0,
  name:"",
  image:"",
  os_image:"",
  animation_url:null,
  os_animation_url:null,
  custom_id:0,
  token_id:0,
  attributes:null,
  score:"",
  rank:null,
  name1:"",
  price:0,
  last_sale:0,
  chain_id:5
}