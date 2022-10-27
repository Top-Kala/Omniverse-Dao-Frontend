import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NftForLaunch from '../../components/NftForLaunch'
import Image from 'next/image'
import Link from 'next/link'
import  { getCollections, selectCollections, getCollectionsForComingAndLive, selectCollectionsForComing, selectCollectionsForLive } from '../../redux/reducers/collectionsReducer'
import Loading from '../../public/images/loading_f.gif'
const Launchpad: NextPage = () => {
  const [sampleCollection, setSampleCollection] = useState<any>({})
  const collections = useSelector(selectCollections)
  const comingFromReduce = useSelector(selectCollectionsForComing)
  const liveFromReduce = useSelector(selectCollectionsForLive)
  const localComing = localStorage.getItem('NftComing')
  const localLive = localStorage.getItem('NftLive')
  let collectionsForComing = []
  let collectionsForLive = []
  if(localComing){
    collectionsForComing = JSON.parse(localComing)
  }else{
    collectionsForComing = comingFromReduce
  }
  if(localLive){
    collectionsForLive = JSON.parse(localLive)
  }else{
    collectionsForLive = liveFromReduce
  } 
  
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCollections() as any)    
  }, [dispatch])
  useEffect(() => { 
    if(collections?.length > 0){           
      dispatch(getCollectionsForComingAndLive() as any)   
      const samples = collections.filter((collection:{col_url: string}) => collection.col_url === 'kanpai_pandas')
      if(samples?.length > 0){
        setSampleCollection(samples[0])
      }
    }
  }, [collections,dispatch])
  return (
    <div className='mt-[75px] w-full px-[130px] pt-[50px]'>
      <div className='flex  justify-between'>
        <div className='flex flex-col'>
          <p className='text-xxl2 font-bold italic'>OMNI X LAUNCHPAD</p>
          <p className='text-xl2'>art for everyone, everwhere </p>
        </div>
        <div className='py-6 px-12 flex flex-col bg-l-50 space-y-4 '>
          <p className='text-xg1 italic font-bold text-center'>
            **CREATORS**
          </p>
          <p className='text-xg text-[#A0B3CC]'>
            Interested in launching your own collection?
          </p>
          <div className='flex space-x-2 justify-center space-x-16 mt-[40px]'>

            <Link href="https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad">
              <a target="_blank">
                <button className='px-2 py-1 text-[#B444F9] border-2 border-[#B444F9] bg-transparent rounded-lg'>
                  learn more
                </button>
              </a>
            </Link>
            <div className='transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]'>
              <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'}>
                <a target="_blank">
                  <button className='px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]'>
                    apply to launchpad
                  </button>
                </a>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
      <div className='flex jutify-left'>
        <div className='text-[#B444F9] w-[600px] italic text-xg1 text-center '>
          featured collection
        </div>
      </div>
      <div className='flex  justify-between mt-[30px]'>
        
        <Link href={`/launchpad/${sampleCollection.col_url?sampleCollection.col_url:''}`}>
          <img className='w-[600px] hover: cursor-pointer' src={sampleCollection.profile_image?sampleCollection.profile_image:'/images/nft.png'} alt='NFT'></img>
        </Link>

        <div className='flex flex-col'>
          <p className='text-xxl2'>
            {sampleCollection.name?sampleCollection.name:'Collection Name'}
          </p>
          <p className='w-[830px] text-xg1 text-[#A0B3CC]'>
            {sampleCollection.description?sampleCollection.description:'Description'}
          </p>
          <Link href={`/collections/${sampleCollection.col_url?sampleCollection.col_url:''}`}>
            <button className='mt-[25px] px-2 py-1 w-[170px]  bg-[#B444F9] text-white rounded-lg'>
              view collection
            </button>
          </Link>
        </div>
      </div>
      <div className='mt-[80px]'>
        {
          (collectionsForLive?.length<=0 || collectionsForComing?.length<=0) &&
            <Image src={Loading} alt='Loading...' width='80px' height='80px'/>

        }
        {
          collectionsForLive?.length>0 &&
          <div className=''>            
            <p className='font-bold text-xl2 mb-[24px]'>
              Live Launches              
            </p>
            <div className='flex flex-wrap space-x-12'>
              {
                collectionsForLive.map((collection: { mint_status: string, totalCnt: string, col_url:string, name:string, profile_image:string, price:string }, index:any) => {
                  return <NftForLaunch key={index} typeNFT={collection.mint_status} items={collection.totalCnt} col_url={collection.col_url} name={collection.name} img={collection.profile_image} price={collection.price} />
                })
              }
            </div>
          </div>
          
        }
        {
          collectionsForComing?.length>0 &&
          <div className=''>            
            <p className='font-bold text-xl2 mb-[24px]'>
              Upcoming              
            </p>
            <div className='flex flex-wrap space-x-12'>
              {
                collectionsForComing.map((collection: { mint_status: string, totalCnt: string, col_url:string, name:string, profile_image:string, price:string }, index:any) => {
                  return <NftForLaunch key={index} typeNFT={collection.mint_status} items={collection.totalCnt} col_url={collection.col_url} name={collection.name} img={collection.profile_image} price={collection.price} />
                })
              }
            </div>
          </div>
          
        }
      </div>
      <div className='bg-l-50 px-[40px] py-[30px] mt-[100px] mb-[50px]'>
        <p className='text-xxl2 font-bold italic'>
          Launch with Omni X
        </p>
        <div className='flex justify-center space-x-20 mt-[80px]'>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Superior UX
          </div>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Unparalleled Liquidity
          </div>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Extensive <br /> Support
          </div>
        </div>
        <div className='flex justify-center mt-[60px]'>
          <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'}>
            <a target="_blank">
              <button className='px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg'>
                apply to launchpad
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )

}

export default Launchpad
