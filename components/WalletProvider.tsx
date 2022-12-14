/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { ethers, Signer } from 'ethers'
import Web3Modal, { IProviderOptions, providers } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import { getChainInfo } from '../utils/constants'
import { WalletContext } from '../contexts/wallet'

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [signer, setSigner] = useState<Signer>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [address, setAddress] = useState<string>()

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      const address = (await provider?.resolveName(name)) || undefined
      cachedResolveName.set(name, address)
      return address
    },
    [provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      const name = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, name)
      return name
    },
    [provider]
  )

  const disconnect = useCallback(async () => {
    if (!web3Modal) return
    web3Modal.clearCachedProvider()
    localStorage.removeItem('walletconnect')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('-walletlink')) {
        localStorage.removeItem(key)
      }
    })
    setSigner(undefined)
  }, [web3Modal])

  const handleAccountsChanged = useCallback(
    () => {
      window.location.reload()
    },
    []
  )

  const handleChainChanged = useCallback(
    () => {
      //window.location.reload()
    },
    []
  )
  const connect = useCallback(async () => {
    if (!web3Modal) throw new Error('web3Modal not initialized')
    try {
      const instance = await web3Modal.connect()
      if (!instance) return
      instance.on('accountsChanged', handleAccountsChanged)
      instance.on('chainChanged', handleChainChanged)
      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()
      setSigner(signer)
      setAddress(await signer.getAddress())
      return signer
    } catch (e) {
      // TODO: better error handling/surfacing here.
      // Note that web3Modal.connect throws an error when the user closes the
      // modal, as "User closed modal"
      console.log('WalletProvider connect error', e)
    }
  }, [web3Modal, handleAccountsChanged])

  const switchNetwork = useCallback(async (chainId: number) => {
    const chainInfo = getChainInfo(chainId)
    const CHAIN_ID = chainInfo?.chainId || 5
    if (window.ethereum) {
      if (window.ethereum.networkVersion !== 5) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(CHAIN_ID) }]
          })
          window.location.reload()
        } catch (e: any) {
          console.log('WalletProvider switchNetwork error', e)
          if (e.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: chainInfo?.name,
                  chainId: ethers.utils.hexValue(CHAIN_ID),
                  nativeCurrency: { name: chainInfo?.nativeCurrency.name, decimals: chainInfo?.nativeCurrency.decimals, symbol: chainInfo?.nativeCurrency.symbol },
                  rpcUrls: chainInfo?.rpc
                }
              ]
            })
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    const infuraId =
      process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    }
    if (
      !window.ethereum ||
      (window.ethereum && !window.ethereum.isCoinbaseWallet)
    ) {
      providerOptions.walletlink = {
        package: WalletLink,
        options: {
          appName: 'Omni-X Marketplace',
          infuraId,
          // darkMode: false,
        },
      }
    }
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      providerOptions['custom-metamask'] = {
        display: {
          logo: providers.METAMASK.logo,
          name: 'Install MetaMask',
          description: 'Connect using browser wallet',
        },
        package: {},
        connector: async () => {
          window.open('https://metamask.io')
          // throw new Error("MetaMask not installed");
        },
      }
    }
    setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions }))
  }, [])

  useEffect(() => {
    if (!web3Modal) return
    const initCached = async () => {
      const cachedProviderJson = localStorage.getItem(
        'WEB3_CONNECT_CACHED_PROVIDER'
      )
      let instance
      if (!cachedProviderJson){
        instance = await web3Modal.connect()
      }else{
        const cachedProviderName = JSON.parse(cachedProviderJson)
        instance = await web3Modal.connectTo(cachedProviderName)
      } 
      
      if (!instance) return
      instance.on('accountsChanged', handleAccountsChanged)
      instance.on('chainChanged', handleChainChanged)
      const provider = new ethers.providers.Web3Provider(instance, 'any')
      const signer = provider.getSigner()
      setProvider(provider)
      setSigner(signer)
      setAddress(await signer.getAddress())
    }
    (async () => {
      await initCached()
    })()
  }, [web3Modal, handleAccountsChanged])

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        web3Modal,
        resolveName,
        lookupAddress,
        switchNetwork,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
