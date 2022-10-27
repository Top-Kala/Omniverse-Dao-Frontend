import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {useDraggable} from '@dnd-kit/core'

import {numberExpression} from '../utils/numberExpress'

import editStyle from '../styles/nftbox.module.scss'
import classNames from '../helpers/classNames'

import Loading from '../public/images/loading_f.gif'
const CollectionCard = (props:any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [image] = useState(props.collection.profile_image)
  const [imageError, setImageError] = useState(false)
  ///only in the beta version

  const { transform} = useDraggable({
    id: `draggable-${1}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined
  return (
    <div className={classNames(' border-[2px] border-[#F6F8FC] w-[340px] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <div className='relative'  style={style} >
        <div >
          <img className='nft-image w-[340px] background-fill' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={()=>{setImageError(true)}} data-src={image} />
        </div>
        <div className={classNames('absolute w-full h-full  flex items-center justify-center  ', editStyle.actionBtn)}>
          <div>
            <Link href={`/collections/${props.collection.col_url}`}>
              <div className='w-[230px] text-[18px] text-white	 text-extrabold text-center items-center bg-[#B444F9] rounded-lg mb-[24px]  py-[7px] hover:cursor-pointer'>view collection</div>
            </Link>
            
            <div className='w-[230px] text-[18px] text-white	 text-extrabold text-center items-center bg-[#38B000] rounded-lg  py-[7px]'>make a collection bid</div>
          </div>
          
        </div>
      </div>
      <div className="flex flex-row mt-2.5 justify-start">
        <div className="ml-3 text-[#000000] text-[20px] font-bold ">
          {props.collection.name}
        </div>        
      </div>
      
      <div className="flex flex-row space-x-2 justify-between p-2">        
        <div className={classNames(' col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)}>
          <div className='text-[14px] flex flex-col justify-between'>
            <span className='font-extrabold mr-[1px] text-center'>Items</span>
            <span className='font-medium text-[12px] text-center'>{props.card?props.card.itemsCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div  className={classNames(' col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <span className='font-extrabold mr-[1px] text-center'>Owners</span>
            <span className='font-medium text-[12px] text-center'>{props.card?props.card.ownerCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div> 
        <div className={classNames('col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <div className='text-[14px] flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
              <div className='text-[14px] font-extrabold  mb-1 text-center'>Floor</div>                      
              <div className='flex flex-row space-x-2 justify-center' >
                <span className='font-medium text-[12px] mr-[px]'>{props.card?numberExpression(props.card.floorPrice.usd):<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
                <img src='/svgs/omni_asset.svg' className='w-[16px]' alt='asset img'></img>
              </div>
            </div>  
          </div>         
        </div>      
        <div className={classNames(' col-span-3 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] font-extrabold mb-1 text-center'>Volume(7d)</div>
          <div className='text-[14px] flex flex-row justify-center space-x-4' >
            <div className='flex flex-row mr-4'>
              <span className='font-medium mr-1 text-[12px]'>{props.card?0:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
              <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
            </div>
            <span className='font-medium text-[#38B000] text-[12px]'> {props.card?'0%':<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
