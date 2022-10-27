import { createContext } from 'react'
import {NFTItem} from '../interface/interface'

export type PendingTxType = {
  txHash?: string,
  destTxHash?: string | undefined,
  type: 'bridge' | 'buy' | 'accept' | 'approve',
  senderChainId: number,
  senderAddress?: string,
  targetChainId: number,
  targetAddress: string,
  isONFTCore: boolean,
  nftItem: NFTItem,
  contractType: 'ERC721' | 'ERC1155',
  targetBlockNumber: number,
  senderBlockNumber?: number,
  itemName: string | undefined
}

export type ContractContextType = {
  listenONFTEvents: (txInfo: PendingTxType, historyIndex: number) => Promise<void>,
}

export const ContractContext = createContext<ContractContextType>({
  listenONFTEvents: async (txInfo: PendingTxType, historyIndex: number) => {},
})

