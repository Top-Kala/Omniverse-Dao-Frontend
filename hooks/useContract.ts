import { useContext } from 'react'
import { ContractContext, ContractContextType } from '../contexts/contract'

const useContract = (): ContractContextType => {
  const context = useContext(ContractContext)
  if (context === undefined) {
    throw new Error('useContract must be used within an WalletProvider')
  }
  return context
}

export default useContract
