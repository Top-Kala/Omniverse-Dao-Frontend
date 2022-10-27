/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { NextPage } from 'next'
import Image from 'next/image'
import { getCollections, selectCollections, updateCollectionsForCard, selectCollectionsForCard} from '../../redux/reducers/collectionsReducer'
import {getOrders} from '../../redux/reducers/ordersReducer'
import pfp from '../../public/images/pfp.png'
import photography from '../../public/images/photography.png'
import gaming from '../../public/images/gaming.png'
import metaverse from '../../public/images/metaverse.png'
import sports from '../../public/images/sports.png'
import generative from '../../public/images/generative.png'
import utility from '../../public/images/utility.png'
import domains from '../../public/images/domains.png'
import fashion from '../../public/images/fashion.png'
import Slider from '../../components/Slider'
import CollectionCard from '../../components/CollectionCard'
import { IGetOrderRequest } from '../../interface/interface'
import useWallet from '../../hooks/useWallet'
import { getChainNameFromId } from '../../utils/constants'
const serviceSlides: Array<React.ReactNode> = []
serviceSlides.push(<Image src={pfp} alt="image - 25" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={photography} alt="image - 26" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={metaverse} alt="image - 27" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={gaming} alt="image - 28" layout='responsive' width={230} height={263}/>)
serviceSlides.push(<Image src={sports} alt="image - 29" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={generative} alt="image - 26" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={utility} alt="image - 27" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={domains} alt="image - 28" layout='responsive' width={230} height={263}/>)
serviceSlides.push(<Image src={fashion} alt="image - 29" layout='responsive' width={230} height={263} />)

const Collections: NextPage = () => {
  const {provider} = useWallet()
  const [omniSlides, setOmniSlides] = useState<Array<React.ReactNode>>([])  
  const dispatch = useDispatch()
  const collections = useSelector(selectCollections)
  const collectionsForCard = useSelector(selectCollectionsForCard)

  
  useEffect(() => {
    if(provider?._network){
      dispatch(updateCollectionsForCard(provider._network.chainId.toString(), getChainNameFromId(provider._network.chainId) ) as any)
    }
  }, [provider?._network])

  useEffect(()=>{
    dispatch(getCollections() as any)
  },[])
  useEffect(() => {
    const slides: Array<React.ReactNode> = []
    const  localCards = localStorage.getItem('cards')
    if(localCards===null){
      if(collections.length>0){
        if(collectionsForCard.length>0){          
          collections.map((item: any) => {
            slides.push(
              <CollectionCard collection={item} card={collectionsForCard.find((card: { col_url: any })=>card.col_url == item.col_url)}/>
            )
          })
        }else{
          collections.map((item: any) => {
            slides.push(
              <CollectionCard collection={item} card={null}/>
            )
          })
        }

      }
    }else{
      if(collections.length>0){
        collections.map((item: any) => {
          slides.push(
            <CollectionCard collection={item} card={collectionsForCard.length>0?collectionsForCard.find((card: { col_url: any })=>card.col_url == item.col_url):JSON.parse(localCards).find((card: { col_url: any })=>card.col_url==item.col_url)}/>
          )
        })
      }
    }
    setOmniSlides(slides)
  }, [collections ,collectionsForCard])
  useEffect(()=>{
    const request: IGetOrderRequest = {
      isOrderAsk: true,
      status: ['VALID'],
      sort: 'PRICE_ASC'
    }
    dispatch(getOrders(request) as any)
  },[])

  return (
    <>
      <div className='pt-10'>
        <Slider  title="Beta Collections" cards={omniSlides} />
      </div>
    </>
  )
}

export default Collections
