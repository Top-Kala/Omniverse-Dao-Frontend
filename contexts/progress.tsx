import { createContext } from 'react'
import {PendingTxType} from './contract'

export type ProgressContextType = {
  histories: PendingTxType[],
  pending: boolean,
  setPending: (pending: boolean) => void,
  addTxToHistories: (txInfo: PendingTxType) => number,
  updateHistory: (historyIndex: number, txInfo: PendingTxType) => void,
  clearHistories: () => void
}

export const ProgressContext = createContext<ProgressContextType>({
  histories: [],
  pending: false,
  setPending: () => undefined,
  addTxToHistories: () => -1,
  updateHistory: () => undefined,
  clearHistories: () => undefined,
})
