import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {WalletProvider} from './WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import {ContractProvider} from './providers/ContractProvider'
import { MoralisProvider } from 'react-moralis'
import Layout from './Layout'

type AppProps = {
    children?: React.ReactNode
}

function App({children}: AppProps) {
  return (
    <React.StrictMode>
      <MoralisProvider serverUrl='https://bbxcpkwdxpay.usemoralis.com:2053/server' appId="rhzWnBuSjhbxwz3Fwho5CYJBW7ecyUrjo17TV8ye" jsKey="l9SXYutcus034DMhALJjh6RFA26tu9Il0NJkFwYg">
        <WalletProvider>
          <BridgeProvider>
            <ProgressProvider>
              <ContractProvider>
                <DndContext>
                  <Layout>{children}</Layout>
                </DndContext>
              </ContractProvider>
            </ProgressProvider>
          </BridgeProvider>
        </WalletProvider>
      </MoralisProvider>
    </React.StrictMode>

  )
}

export default App
