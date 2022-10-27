interface IChain {
   [key: string]: string
}

interface ICrypto{
	[key: string]: string
}
interface ICryptoObj{
  [key: string]: ICrypto
}

interface IRpcDatafeed{
  [key: string]: string
}
export const chain_list:IChain = {
  'eth': 'eth',
  'bsc': 'bsc',
  'matic': 'matic',
  'avalanche': 'avalanche',
  'fantom': 'fantom',
  'optimism': 'optimism',
  'arbitrum': 'arbitrum',
  'bsc testnet': 'bsc',
  'rinkeby': 'eth',
  'mumbai': 'matic',
  'avalanche testnet': 'avalanche'
}

export const crypto_list:ICryptoObj = {
  'eth':{
    'eth':'0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    'avax':'0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7',
    'bnb':'0x14e613AC84a31f709eadbdF89C6CC390fDc9540A',
    'ftm':'0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b',
    'matic':'0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676'
  },
  'bsc':{
    'eth':'0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    'avax':'0x5974855ce31EE8E1fff2e76591CbF83D7110F151',
    'bnb':'0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    'ftm':'0xe2A47e87C0f4134c8D06A41975F6860468b2F925',
    'matic':'0x7CA57b0cA6367191c94C8914d7Df09A57655905f'
  }
}

export const rpcDatafeedProvider:IRpcDatafeed = {
  'eth':'https://rpc.ankr.com/eth',
  'bsc':'https://rpc.ankr.com/bsc',
  'arbitrm':'https://rpc.ankr.com/arbitrum',
  'avalanche':'https://rpc.ankr.com/avalanche',
  'fantom':'https://rpc.ankr.com/fantom',
  'optimism':'https://rpc.ankr.com/optimism',
  'polygon':'https://rpc.ankr.com/polygon'

}
export const rpcGasProvider:IRpcDatafeed = {
  'eth':'https://rpc.ankr.com/eth',
  'bsc':'https://rpc.ankr.com/bsc',
  'arbitrm':'https://rpc.ankr.com/arbitrum',
  'avalanche':'https://api.avax.network/ext/bc/C/rpc',
  'fantom':'https://rpc.ankr.com/fantom',
  'optimism':'https://rpc.ankr.com/optimism',
  'polygon':'https://rpc.ankr.com/polygon'

}
