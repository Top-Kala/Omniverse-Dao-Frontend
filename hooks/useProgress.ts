import { useContext } from 'react'
import { ProgressContext, ProgressContextType } from '../contexts/progress'

const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within an WalletProvider')
  }
  return context
}

export default useProgress
