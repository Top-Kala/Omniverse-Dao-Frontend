import React from 'react'
import Fail from '../public/images/fail.png'
import Image from 'next/image'
import ConnectButton from './ConnectButton'
import SwitchButton from './SwitchButton'
import { WalletContextType } from '../contexts/wallet'
import { supportChainIDs } from '../utils/constants'

type ConnectButtonProps = {
  onConnect: () => Promise<void>

  context:WalletContextType
}
const MetaMaskConnect = ({onConnect, context}:ConnectButtonProps): JSX.Element => {
  const [show, setShow] = React.useState<boolean>(true)
  const [chainId, setChainID] = React.useState<number>(4)

  React.useEffect(()=>{
    if(context.address && context.provider && context.provider._network && context.provider._network.chainId) {
      if(Number(context.provider._network.chainId)>0){
        setChainID(context.provider._network.chainId as number)
        if(supportChainIDs.includes(context.provider._network.chainId as number)){
          setShow(false)
        }
      }
    } else setShow(true)
  },[context])

  const signSection = () => {
    if(!context.address){
      return(
        <div>
          <div>Please sign-in by connecting your wallet</div>
          <div className='flex justify-center mt-20'><ConnectButton onConnect={onConnect} /></div>
        </div>
      )
    } else if(!supportChainIDs.includes(chainId)&&context.address){
      return(
        <div>
          <div>Current network is not supported <br></br> Please switch network into Goerli</div>
          <div className='flex justify-center mt-20'><SwitchButton  chainID={5} /></div>
        </div>
      )
    }
  }

  return (
    <>
      {show && <div className="flex justify-center items-center w-screen h-screen bg-[#ffffff90] fixed z-[1]">
        <div className="flex flex-col justify-center border-4 border-[#1E1C21] p-20 rounded-[10px] bg-[#ffffff] text-[32px] font-bold">
          <div className='flex justify-center mb-10'><Image src={Fail} alt="fail" /></div>
          {signSection()}
        </div>
      </div>}
    </>
  )
}

export default MetaMaskConnect
