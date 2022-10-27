import { useContext } from 'react'
import { BridgeContext, BridgeContextType } from '../contexts/bridge'

const useBridge = (): BridgeContextType => {
  const context = useContext(BridgeContext)
  if (context === undefined) {
    throw new Error('useBridge must be used within an WalletProvider')
  }
  return context
}

export default useBridge
