/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'
import { getNFTInfo, selectNFTInfo } from '../../../redux/reducers/collectionsReducer'
import useWallet from '../../../hooks/useWallet'
import useTrading from '../../../hooks/useTrading'
import { formatCurrency, getChainIcon, getChainNameFromId, getCurrencyIconByAddress, getCurrencyNameAddress, getProfileLink } from '../../../utils/constants'
import PngCheck from '../../../public/images/check.png'
import PngSub from '../../../public/images/subButton.png'
import PngEther from '../../../public/images/collections/ethereum.png'
import useOrderStatics from '../../../hooks/useOrderStatics'
import useOwnership from '../../../hooks/useOwnership'
import { findCollection } from '../../../utils/constants'
import { useMemo } from 'react'

const truncate = (str: string) => {
  return str.length > 12 ? str.substring(0, 9) + '...' : str
}

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')

  const nftInfo = useSelector(selectNFTInfo)
  const dispatch = useDispatch()
  const {
    provider,
    address,
    signer
  } = useWallet()

  const router = useRouter()
  const col_url = router.query.collection as string
  const token_id = router.query.item as string
  const collection_address_map = nftInfo?.collection?.address

  const collectionInfo = useMemo(() => {
    if (nftInfo && nftInfo.collection && nftInfo.nft && token_id) {
      return findCollection(nftInfo.collection.address,nftInfo.nft,token_id)
    }
    return undefined
  }, [nftInfo,token_id])
  const  collection_address = collectionInfo?.[0]
  const chain_id = collectionInfo?.[1]
  // ownership hook
  const {
    owner,
    ownerType,
    ownerChainId,
    collectionAddress: ownedCollectionAddress
  } = useOwnership({
    collection_address_map,
    token_id
  })

  // statistics hook
  const {
    order,
    orderChainId,
    isListed,
    isAuction,
    sortedBids,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  } = useOrderStatics({
    nft: nftInfo?.nft,
    collection_address_map,
    isDetailPage: true
  })

  const order_collection_address = order?.collectionAddress
  const order_collection_chain = orderChainId && getChainNameFromId(orderChainId)

  // trading hook
  const {
    openBidDlg,
    openSellDlg,
    setOpenBidDlg,
    setOpenSellDlg,
    getListOrders,
    getBidOrders,
    getLastSaleOrder,
    onListing,
    onBuy,
    onBid,
    onAccept
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: col_url,
    collection_address,
    order_collection_address,
    order_collection_chain,
    owner,
    owner_collection_address: ownedCollectionAddress,
    owner_collection_chain: ownerChainId && getChainNameFromId(ownerChainId),
    token_id,
    selectedNFTItem: nftInfo?.nft
  })

  // nft info api call
  useEffect(() => {
    if (col_url && token_id ) {
      dispatch(getNFTInfo(col_url, token_id) as any)
    }
  }, [col_url, token_id])

  // order api call
  useEffect(() => {
    if (nftInfo) {
      getListOrders()
      getBidOrders()
      getLastSaleOrder()
    }
  }, [nftInfo, owner])

  // profile link
  const profileLink = chain_id && ownerType && owner && getProfileLink(Number(chain_id), ownerType, owner)
  const currencyIcon = getCurrencyIconByAddress(order?.currencyAddress)
  const formattedPrice = formatCurrency(order?.price || 0, getCurrencyNameAddress(order?.currencyAddress))
  
  return (
    <>
      {nftInfo?.nft?.token_id === Number(token_id) && nftInfo?.collection?.col_url === col_url &&
        <div className="w-full mt-40 pr-[70px] pb-[120px] font-[Retni_Sans]">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-3 2xl:gap-12 lg:gap-1 xl:gap-4">
              <div className="col-span-1 h-full">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>}>
                  <img className='rounded-[8px]' src={imageError?'/images/omnix_logo_black_1.png':nftInfo.nft.image} alt="nft-image" onError={()=>{setImageError(true)}} data-src={nftInfo.nft.image} />
                </LazyLoad>
              </div>
              <div className="col-span-2">
                <div className="px-6 py-3 bg-[#F6F8FC]">
                  <div className='flex items-center'>
                    <h1 className="text-[#1E1C21] text-[32px] font-extrabold mr-8">{nftInfo.collection.name}</h1>
                    <div className='h-[22px]'><Image src={PngCheck} alt="checkpng"/></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <h1 className="text-[#1E1C21] text-[24px] font-medium">{nftInfo.nft.token_id}</h1>
                    <Image src={PngSub} alt=""/>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pt-3 mt-6 bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="flex justify-start items-center">
                      <h1 className="text-[#1E1C21] text-[18px] font-bold">owner:</h1>
                      {owner && ownerType=='address' && (
                        <h1 className="text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={profileLink || '#'}>
                            <a target='_blank'>{truncate(owner)}</a>
                          </Link>
                        </h1>
                      )}

                    </div>
                    <div className="flex justify-between items-center mt-6">
                      {order && (
                        <>
                          <h1 className="text-[#1E1C21] text-[60px] font-normal">{Number(formattedPrice)>=1000?`${Number(formattedPrice)/1000}K`:formattedPrice}</h1>
                          <div className="mr-5">
                            {currencyIcon &&
                              <img
                                src={`${currencyIcon}`}
                                className='mr-[8px] w-[21px]'
                                alt="icon"
                              />
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className='font-normal font-[16px]'>{formattedPrice && '$'}{Number(formattedPrice)>=1000?`${Number(formattedPrice)/1000}K`:formattedPrice}</span>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-bold">Highest Bid: <span className="font-bold">{Number(highestBid)>=1000?`${Number(highestBid)/1000}K`:highestBid}</span></h1>{highestBidCoin&&<Image src={highestBidCoin} width={15} height={16} alt="chain  logo" />}</div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-bold">Last Sale: <span className="font-bold">{lastSale != 0 && Number(lastSale)>=1000?`${Number(lastSale)/1000}K`:lastSale}</span></h1>{lastSaleCoin&&<Image src={lastSaleCoin} width={15} height={16} alt="chain logo" />}</div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] min-h-[210px] max-h-[210px]">
                      <div className="font-bold text-[18px] text-[#000000]">account</div>
                      <div className="font-bold text-[18px] text-[#000000]">chain</div>
                      <div className="font-bold text-[18px] text-[#000000]">bid</div>
                      <div></div>
                      {
                        sortedBids?.map((item, index) => {
                          return (
                            <Fragment key={index}>
                              <div className='break-all mt-3 text-[16px] font-bold'>{truncate(item.signer)}</div>
                              <div className="text-center mt-3">
                                <img
                                  src={getChainIcon(item.chain)}
                                  className='mr-[8px] w-[21px]'
                                  alt="icon"
                                />
                              </div>
                              <div className='flex justify-start mt-3'>
                                <div className="mr-5">
                                  <img
                                    src={getCurrencyIconByAddress(item.currencyAddress)}
                                    className='mr-[8px] w-[21px]'
                                    alt="icon"
                                  />
                                </div>
                                <p className='ml-3'>${item && item.price && ethers.utils.formatEther(item.price)}</p>
                              </div>
                              <div className='text-right mt-3'>
                                {owner?.toLowerCase() == address?.toLowerCase() &&
                                  <button className='bg-[#ADB5BD] hover:bg-[#38B000] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5'
                                    onClick={() => onAccept(item)}>
                                    accept
                                  </button>
                                }
                              </div>
                            </Fragment>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pb-3  bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="mb-3">
                      <div className="">
                        { isListed && !isAuction && owner?.toLowerCase() != address?.toLowerCase() &&
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]" onClick={()=>onBuy(order)}>buy</button>
                        }
                        { owner?.toLowerCase() == address?.toLowerCase() &&
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]" onClick={() => {setOpenSellDlg(true)}}>sell</button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    { owner && address && owner.toLowerCase() != address.toLowerCase() &&
                      <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]" onClick={() => {setOpenBidDlg(true)}}>bid</button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div>
                <ul className="flex flex-wrap relative justify-item-stretch text-sm font-medium text-center text-gray-500">
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='items'?' text-[#1E1C21] border-b-2 border-black':' text-[#A0B3CC]'}`} onClick={()=>setCurrentTab('items')}>properties</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='activity'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >activity</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='info'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >info</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='stats'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >stats</li>
                </ul>
              </div>
              <div className="border-2 border-[#E9ECEF] bg-[#F6F8FC] px-10 py-8">
                {
                  currentTab == 'items' &&
                  <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                    {
                      Object.entries(nftInfo.nft.attributes).map((item, idx) => {
                        const attrs = nftInfo.collection.attrs
                        const attr = attrs[item[0]].values
                        const trait = attr[(item[1] as string).toLowerCase()]
                        return <div className="px-5 py-2 bg-[#b444f926] border-2 border-[#B444F9] rounded-[8px]" key={idx}>
                          <p className="text-[#B444F9] text-[12px] font-bold">{item[0]}</p>
                          <div className="flex justify-start items-center mt-2">
                            <p className="text-[#1E1C21] text-[18px] font-bold">{item[1]}<span className="ml-3 font-normal">[{trait[1]}%]</span></p>
                            <p className="ml-5 mr-3 text-[#1E1C21] text-[18px] ml-auto">{order && order.price && ethers.utils.formatEther(order.price)}</p>
                            <Image src={PngEther} alt="" />
                          </div>
                        </div>
                      })
                    }
                  </div>
                }
              </div>
            </div>
          </div>
          <ConfirmSell onSubmit={onListing} handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
          <ConfirmBid onSubmit={(bidData: any) => onBid(bidData, order)} handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
        </div>
      }
    </>
  )
}

export default Item
