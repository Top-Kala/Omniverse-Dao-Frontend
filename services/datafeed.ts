import { ethers } from "ethers"
import {crypto_list, rpcDatafeedProvider, rpcGasProvider} from '../utils/utils'
import Aggregator from '../constants/abis/AggregatvorV3.json'

interface PriceData {
  [key:string]: string
}
export const getPriceforUSD = async( chain:string, crypto:string) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcDatafeedProvider[chain])
  const priceFeed = new ethers.Contract(crypto_list[chain][crypto], Aggregator, provider)
  let result:any = 0
  await priceFeed.latestRoundData()
    .then((roundData:any) => {
      result = (parseFloat((roundData.answer))/100000000.0)     
    })
   return result.toFixed(3)
  
}
const getGasOnChain = async(chain:string) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcGasProvider[chain])
  const gasPrice = ethers.utils.formatUnits(await provider.getGasPrice(), "gwei")
  return parseFloat(gasPrice).toFixed(3)
}

export const getGasOnChains = async() => {
  return {
    'eth': await getGasOnChain('eth'),
    'bsc': await getGasOnChain('bsc'),
    'arbitrm': await getGasOnChain('arbitrm'),
    'avalanche': await getGasOnChain('avalanche'),
    'fantom': await getGasOnChain('fantom'),
    'optimism': await getGasOnChain('optimism'),
    'polygon': await getGasOnChain('polygon')   
  }}


export const getPriceFeeddata = async()=>{
  let result:PriceData = {
    'eth':  await getPriceforUSD('eth','eth'),
    'bnb':  await getPriceforUSD('bsc','bnb'),
    'avax': await getPriceforUSD('bsc','avax'),
    'ftm':  await getPriceforUSD('bsc','ftm'),
    'matic':  await getPriceforUSD('bsc','matic')
  }
  return result
}

