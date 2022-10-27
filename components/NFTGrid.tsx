/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import NFTBox from './NFTBox'
import NFTbox from './collections/NFTBox'
import { IPropsImage } from '../interface/interface'
import { getOrders,getLastSaleOrders } from '../redux/reducers/ordersReducer'
import { IGetOrderRequest } from '../interface/interface'
import useWallet from '../hooks/useWallet'
import { useDispatch, useSelector } from 'react-redux'
import { getCollections } from '../redux/reducers/collectionsReducer'
import { selectSearchText } from '../redux/reducers/headerReducer'
import { getCollectionInfo,getCollectionAllNFTs, selectCollectionAllNFTs,selectCollectionInfo } from '../redux/reducers/collectionsReducer'
import { chainList } from '../utils/constants'

const NFTGrid = ({ nfts }: IPropsImage) => {
  const [chain, setChain] = useState('all')
  const [isSearch, setSearch] = useState(false)
  const [nft, setNFT] = useState(null)
  const [colURL, setColURL] = useState('')
  const [tokenID, setTokenID] = useState(0)

  const {
    address
  } = useWallet()
  const dispatch = useDispatch()
  const searchText = useSelector(selectSearchText)
  const col_url = searchText.split('#')[0]
  const token_id = searchText.split('#')[1]

  const allNFTs = useSelector(selectCollectionAllNFTs)
  const collectionInfo = useSelector(selectCollectionInfo)

  useEffect(()=>{
    if(searchText==''){
      setSearch(false)
    }else{
      if(col_url!=''&&Number(token_id)>0){
        setSearch(true)
        setColURL(col_url)
        setTokenID(Number(token_id))
        if(colURL!=col_url){
          dispatch(getCollectionAllNFTs(col_url,'','') as any)
        }
        dispatch(getCollectionInfo(col_url) as any)
      } else{
        setSearch(false)
      }
    }

  },[searchText])


  useEffect(() => {
    if(allNFTs && tokenID>0){
      setNFT(allNFTs[tokenID-1])
    }
  }, [allNFTs,tokenID])

  useEffect(() => {
    dispatch(getCollections() as any)
  }, [])


  useEffect(()=> {
    if(nfts.length>0){
      const request: IGetOrderRequest = {
        isOrderAsk: true,
        signer: address,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'OLDEST'
      }
      dispatch(getOrders(request) as any)

      const bidRequest: IGetOrderRequest = {
        isOrderAsk: false,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'PRICE_ASC'
      }
      dispatch(getOrders(bidRequest) as any)

      const excutedRequest: IGetOrderRequest = {
        status: ['EXECUTED'],
        sort: 'UPDATE_OLDEST'
      }
      dispatch(getLastSaleOrders(excutedRequest) as any)
    }
  },[nfts])
  


  return (
    <>
      <div className="w-full mb-5 ">
        <div className="flex relative justify-start bg-[#F8F9FA] pl-2 pr-2 w-fit" style={{'width':'100%'}}>
          {
            chainList.map((item, index) => {
              return <div
                key={index}
                className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px] ${chain == item.chain ? 'bg-[#C8D6E8]' : ''} `}
                onClick={() =>{setChain(!item.disabled ? item.chain : chain)}}
              >
                <img alt={'listing'} src={item.img_url} className="w-[21px] h-[22px] " />
              </div>
            })
          }
          <div className="flex p-3 font-medium cursor-pointer text-[#6C757D] absolute right-0">
            <img alt={'listing'} src='/images/listing.png' className="w-[21px] h-[22px]"/>
            <span>active listing</span>
            <img alt={'listing'} src='/images/downArrow.png' className="w-[10px] h-[7px] ml-5 mt-auto mb-auto"/>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 2xl:grid-cols-5 2xl:gap-10 mt-4">
          {!isSearch&&nfts.map((item, index) => {
            if(chain == 'all'){
              return (
                <NFTBox nft={item} index={index} key={index}/>
              )
            } else {
              if(chain == item.chain) {
                return (
                  <NFTBox nft={item} index={index} key={index} />
                )
              }
            }
          })}
          {
            isSearch&&nft!=null&&<NFTbox nft={nft} index={1} col_url={col_url} col_address={collectionInfo.address}  chain={collectionInfo?collectionInfo.chain:'goerli'}/>
          }
        </div>
      </div>
    </>
  )
}

export default NFTGrid
