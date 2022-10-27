import { createContext } from 'react'
import {NFTItem} from '../interface/interface'
import {BigNumber} from 'ethers'

export type UnwrapInfo = {
  type: 'ERC721' | 'ERC1155',
  chainId: number,
  originAddress: string,
  persistentAddress: string,
  amount: number,
  tokenId: string
}

export type BridgeContextType = {
  estimating: boolean,
  unwrapInfo: UnwrapInfo | undefined,
  selectedUnwrapInfo: UnwrapInfo | undefined,
  validateOwNFT: (nft: NFTItem) => Promise<boolean>,
  validateONFT: (nft: NFTItem) => Promise<boolean>,
  estimateGasFee: (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => Promise<BigNumber>,
  estimateGasFeeONFTCore: (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => Promise<BigNumber>
}

export const BridgeContext = createContext<BridgeContextType>({
  estimating: false,
  unwrapInfo: undefined,
  selectedUnwrapInfo: undefined,
  validateOwNFT: async () => false,
  validateONFT: async () => false,
  estimateGasFee: async () => BigNumber.from('0'),
  estimateGasFeeONFTCore: async () => BigNumber.from('0'),
})

