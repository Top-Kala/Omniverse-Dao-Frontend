/* eslint-disable react-hooks/exhaustive-deps */
import {ReactNode, useEffect} from 'react'
import { PendingTxType, ContractContext } from '../../contexts/contract'
import { getERC1155Instance, getERC721Instance, getOmnixBridge1155Instance, getOmnixBridgeInstance, getONFTCore1155Instance, getONFTCore721Instance } from '../../utils/contracts'
import { useDispatch } from 'react-redux'
import { getUserNFTs } from '../../redux/reducers/userReducer'
import useWallet from '../../hooks/useWallet'
import useProgress from '../../hooks/useProgress'

type ContractProviderProps = {
  children?: ReactNode
}

export const ContractProvider = ({
  children,
}: ContractProviderProps): JSX.Element => {
  const dispatch = useDispatch()
  const { address, provider } = useWallet()
  const { updateHistory } = useProgress()

  const listenBridgeONFTCoreEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && provider?._network?.chainId) {
      if (txInfo.contractType === 'ERC721') {
        const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)

        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
                && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex, {
                ...txInfo,
                ...{
                  destTxHash: eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              destTxHash: eventExist[0].transactionHash
            }
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const targetCoreInstance = getONFTCore1155Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
            && parseInt(ev.args?._amount) === parseInt(txInfo.nftItem.amount)
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?._tokenId === txInfo.nftItem.token_id
                && ev.args?._amount === txInfo.nftItem.amount
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex,{
                ...txInfo,
                ...{
                  destTxHash: eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              destTxHash: eventExist[0].transactionHash
            }
          })
        }
      }
    }
  }

  const listenBridgeEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && provider?._network?.chainId) {
      if (txInfo.contractType === 'ERC721') {
        const noSignerOmniXInstance = getOmnixBridgeInstance(txInfo.targetChainId, null)
        const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
            && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
        })

        if (eventExist.length === 0) {
          noSignerOmniXInstance.on('LzReceive', async () => {
            const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex,{
                ...txInfo,
                ...{
                  destTxHash: eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex,{
            ...txInfo, ...{
              destTxHash: eventExist[0].transactionHash
            }
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(txInfo.targetChainId, null)
        const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?.toAddress === address
            && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
            // && ev.args?.amount.toString() === txInfo.nftItem.amount
        })

        if (eventExist.length === 0) {
          noSignerOmniX1155Instance.on('LzReceive', async () => {
            const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
                // && ev.args?.amount.toString() === txInfo.nftItem.amount
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex, {
                ...txInfo,
                ...{
                  destTxHash: eventExist[0].transactionHash
                }
              })
            }
            if (address) {
              setTimeout(() => {
                dispatch(getUserNFTs(address) as any)
              }, 30000)
            }
          })
        } else {
          updateHistory(historyIndex,{
            ...txInfo, ...{
              destTxHash: eventExist[0].transactionHash
            }
          })
        }
      }
    }
  }

  const listenTradingONFTCoreEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && provider?._network?.chainId) {
      if (txInfo.contractType === 'ERC721') {
        const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)

        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
                && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex, {
                ...txInfo,
                ...{
                  txHash: txInfo.txHash || eventExist[0].transactionHash,
                  destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              txHash: txInfo.txHash || eventExist[0].transactionHash,
              destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
            }
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const targetCoreInstance = getONFTCore1155Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
            && parseInt(ev.args?._amount) === parseInt(txInfo.nftItem.amount)
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?._tokenId === txInfo.nftItem.token_id
                && ev.args?._amount === txInfo.nftItem.amount
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex,{
                ...txInfo,
                ...{
                  txHash: txInfo.txHash || eventExist[0].transactionHash,
                  destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              txHash: txInfo.txHash || eventExist[0].transactionHash,
              destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
            }
          })
        }
      }
    }
  }
  const listenTradingEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && txInfo.senderAddress) {
      if (txInfo.contractType === 'ERC721') {
        const sellerNftInstance = getERC721Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?.to.toLowerCase() === address.toLowerCase()
            && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem.token_id)
        })
        if (eventExist.length === 0) {
          sellerNftInstance.on('Transfer', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.to.toLowerCase() === address.toLowerCase()
                && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem.token_id)
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex, {
                ...txInfo,
                ...{
                  txHash: txInfo.txHash || eventExist[0].transactionHash,
                  destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              txHash: txInfo.txHash || eventExist[0].transactionHash,
              destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
            }
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const sellerNftInstance = getERC1155Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?.to.toLowerCase() === address?.toLowerCase()
            && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem.token_id)
            && parseInt(ev.args?.amount) === parseInt(txInfo.nftItem.amount)
        })
        if (eventExist.length === 0) {
          sellerNftInstance.on('TransferSingle', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.to.toLowerCase() === address?.toLowerCase()
                && ev.args?.tokenId === txInfo.nftItem.token_id
                && ev.args?.amount === txInfo.nftItem.amount
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex,{
                ...txInfo,
                ...{
                  txHash: txInfo.txHash || eventExist[0].transactionHash,
                  destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
                }
              })
            }
            setTimeout(() => {
              dispatch(getUserNFTs(address) as any)
            }, 30000)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              txHash: txInfo.txHash || eventExist[0].transactionHash,
              destTxHash: txInfo.destTxHash || eventExist[0].transactionHash
            }
          })
        }
      }
    }
  }

  const listenONFTEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (txInfo.type === 'bridge') {
      if (txInfo.isONFTCore) {
        listenBridgeONFTCoreEvents(txInfo, historyIndex)
      } else {
        listenBridgeEvents(txInfo, historyIndex)
      }
    }
    else if (txInfo.type === 'buy' || txInfo.type === 'accept') {
      console.log('-tx-', txInfo, historyIndex)
      if (txInfo.isONFTCore) {
        listenTradingONFTCoreEvents(txInfo, historyIndex)
      } else {
        listenTradingEvents(txInfo, historyIndex)
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (address && provider?._network?.chainId) {
        const allHistories = localStorage.getItem('txHistories')
        const txInfos = allHistories ? JSON.parse(allHistories) : []
        await Promise.all(
          txInfos.map(async (txInfo: PendingTxType) => {
            await listenONFTEvents(txInfo, txInfos.indexOf(txInfo))
          })
        )
      }
    })()
  }, [address, provider])

  return (
    <ContractContext.Provider
      value={{
        listenONFTEvents
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}