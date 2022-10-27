import React from 'react'

export interface IPropsSlider {
  title?: string
  cards: Array<React.ReactNode>
}

export interface IPropsImage {
  nfts: Array<NFTItem>
}

export interface IPropsFeed {
  feed: Array<FeedItem>
}

export interface IPropsNFTItem {
  nft: NFTItem,
  col_url?: string,
  chain?: string,
  col_address?:string,
  index: number
}

export interface NFTItem {
  name: string,
  attributes: Object,
  image: string,
  custom_id: number,
  token: string,
  score: number,
  rank: number,
  token_id: string,
  name1: string,
  price: number,
  last_sale:number,
  chain_id:number,
  metadata: string,
  token_uri: string,
  amount: string,
  contract_type: string,
  chain: string,
  token_address: string,
  uri: string,
}

export interface FeedItem {
  image: React.ReactNode
  love: number
  view: number
  chain: string
  title: string
  id: string
  owner: string
  postedby: string
  alert?: {
    content: string
    percent: number
  }
}

export const ItemTypes = {
  NFTBox: 'nftbox'
}

export interface IGetOrderRequest {
  isOrderAsk?: boolean,
  chain?: string,
  collection?: string,
  tokenId?: string,
  signer?: string,
  nonce?: string,
  strategy?: string,
  currency?: string,
  price?: any,
  startTime?: string,
  endTime?: string,
  status?: [string],
  pagination?: any,
  sort?: string
}

export interface IOrder {
  chain: string,
  collectionAddress: string,
  tokenId: string,
  isOrderAsk: boolean,
  signer: string,
  strategy: string,
  currencyAddress: string,
  amount: number,
  price: string,
  nonce: string,
  startTime: number,
  endTime: number,
  minPercentageToAsk: number,
  params: any[],
  signature: string,
  v: number,
  r: string,
  s: string,
  hash: string,
  status: OrderStatus
}

export type OrderStatus = 'EXECUTED' | 'EXPIRED'

export interface IAcceptOrderRequest {
  hash: string,
  status: OrderStatus
}

export interface ICollectionInfoFromLocal{
  col_url: string,
  itemsCnt: string,
  ownerCnt:string,
  orderCnt:string,
  floorPrice:{eth:string, usd:string}
}


export interface ITypeNFT{
  typeNFT:string,
  items:string,
  col_url:string,
  name:string,
  img:string,
  price:string
}

export interface contractInfo{
  [key: string]: {
    address: string,
    imageSVG: string,
    name: string,
    price: number,
    chainId: string,
    unit: string,
    color: string,
    index: number
  }
}


export interface IListingData {
  price: number,
  currencyName: string,
  period: number,
  isAuction: boolean
}

export interface IBidData {
  price: number,
  currencyName: string
}
