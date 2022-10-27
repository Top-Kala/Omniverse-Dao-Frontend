/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useWallet  from '../hooks/useWallet'
import { useMoralis } from 'react-moralis'
import classNames from '../helpers/classNames'
import Twitter from '../public/images/twitter.png'
import Web from '../public/images/web.png'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, updateIsGregHolder} from '../redux/reducers/userReducer'
import Carousel from './carousel'
import {chainsFroSTG, GregContractAddress, veSTGContractAddress } from '../constants/addresses'

import { getChainIdFromName } from '../utils/constants'
import { getVeSTGInstance } from '../utils/contracts'
import Hgreg from '../public/images/gregs/logo.png'
import Stg from '../public/images/stg/stg.png'

type BannerProps = {
  slides: Array<React.ReactNode>
  blur: boolean
  menu: string
}

const timeout = (delay: number) =>{
  return new Promise( res => setTimeout(res, delay) )
}
const Banner =  ({ slides, blur, menu }: BannerProps): JSX.Element => {
  const disptach = useDispatch()
  const cuser = useSelector(selectUser)
  const { isInitialized, Moralis } = useMoralis()
  const { address } = useWallet()
  const [avatarError, setAvatarError] = useState(false)
  const [isGregHolder, setIsGregHolder] = useState(false)
  const [isStgStacker, setIsStgStacker] = useState(false)
  const [balances, setBalanceSTG] = useState(0)
  const DEFAULT_AVATAR = 'uploads\\default_avatar.png'

  const fetchNFTByAddress = async(chain:'eth'|'bsc'|'polygon'|'avalanche'|'fantom',contractAddress:string) =>{
    await timeout(1000)
    const nft= await Moralis.Web3API.account.getNFTsForContract({chain: chain, address:address?address:'',token_address: contractAddress})
    if(nft.total){
      setIsGregHolder(true)
    }
  }

  const fetchToken =async(chain:string)=>{
    const veSTGInstance = getVeSTGInstance(veSTGContractAddress[chain], getChainIdFromName(chain) , null)
    setBalanceSTG(await veSTGInstance.balanceOf(address))
  }

  useEffect(() => {
    if (isInitialized && address) {
      fetchNFTByAddress('eth',String(GregContractAddress['eth']))
      fetchNFTByAddress('bsc',String(GregContractAddress['bsc']))
      fetchNFTByAddress('polygon',String(GregContractAddress['polygon']))
      fetchNFTByAddress('avalanche',String(GregContractAddress['avalanche'])) 
      fetchNFTByAddress('fantom',String(GregContractAddress['fantom']))
      chainsFroSTG.map((chain)=>{
        fetchToken(chain)
      })
    }
  }, [isInitialized, Moralis, address])

  useEffect(()=>{
    disptach(updateIsGregHolder(isGregHolder) as any)
  },[isGregHolder])
  useEffect(()=>{
    if(balances>0){
      setIsStgStacker(true)
    }
  },[balances])
  return (
    <>
      <div
        className={classNames(
          'w-full',
          'mt-[134px]',
          menu==='home'? 'h-[500px]':'h-[300px]',
          blur && menu ==='home'? 'blur-sm' : ''
        )}
      >
        <div>
          <Carousel slides={slides} />
        </div>
        {menu === 'home' && (
          <div className="flex justify-center w-full ">
            <div className="flex justify-between justify-center fw-60 mt-5 relative">
              <div className="bottom-[0rem] left-[4rem]  absolute">
                <Image
                  src={avatarError||cuser.avatar===undefined||cuser.avatar===DEFAULT_AVATAR?'/images/default_avatar.png':(process.env.API_URL + cuser.avatar)}
                  alt="avatar"
                  onError={()=>{cuser.avatar&&setAvatarError(true)}}
                  width={200}
                  height={200}
                  className={'rounded-[8px]'}
                />
              </div>
              <div className="flex flex-col ml-[20rem] mt-[10px]">

                <div className="flex flex-row h-8">
                  <div className="flex items-center text-[26px] text-slate-800 font-semibold mr-[16px]">{cuser.username ? cuser.username : 'username'}</div>
                  {
                    isGregHolder&&<div className='mr-2'><Image src={Hgreg} alt="avatar" width='30px' height='30px' /></div>
                  }
                  {
                    isStgStacker&&<Image src={Stg} alt="avatar" width='30px' height='30px' />
                  }
                </div>

                <div className="text-[#6C757D] text-[16px] text-slate-800">
                  {cuser.bio?cuser.bio:'You can see the short description about your account'}
                </div>
              </div>
              <div className="flex ml-[]">
                <Link href={cuser.twitter?cuser.twitter:''}>
                  <a target="_blank">
                    <div className="mr-6">
                      <Image src={Twitter} alt='twitter' />
                    </div>
                  </a>
                </Link>
                <Link href={cuser.website?cuser.website:''}>
                  <a target="_blank">
                    <div className="mr-6">
                      <Image src={Web} alt='website' />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Banner
