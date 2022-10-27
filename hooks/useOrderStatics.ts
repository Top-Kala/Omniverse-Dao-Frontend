import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { IOrder } from "../interface/interface"
import { selectBidOrders, selectLastSaleOrders, selectOrders } from "../redux/reducers/ordersReducer"
import { selectCollectionInfo } from "../redux/reducers/collectionsReducer"
import { SaleType } from "../types/enum"
import { formatCurrency, getCurrencyIconByAddress, getCurrencyNameAddress } from "../utils/constants"

export type OrderStatics = {
  order?: IOrder,
  orderChainId?: number,
  isListed: boolean,
  isAuction: boolean,
  sortedBids?: IOrder[],
  highestBid?: number,
  highestBidCoin?:  string,
  lastSale?: number,
  lastSaleCoin?:  string,
}

const findOrder = (orders: IOrder[], token_id: number, collection_addresses: string[], isDetailPage: boolean) => {
  if (isDetailPage) {
    if (collection_addresses.indexOf(orders[0].collectionAddress) != -1
      && token_id === Number(orders[0].tokenId)) {
      return orders[0]
    }
  }
  else {
    return [...orders].find(order => (
      collection_addresses.indexOf(order.collectionAddress) != -1
      && token_id === Number(order.tokenId)
    ))
  }
  return undefined
}

const useOrderStatics = ({
  nft,
  collection_address_map,
  isDetailPage
}: any): OrderStatics => {
  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders) as IOrder[]
  const lastSaleOrders = useSelector(selectLastSaleOrders)
  const collectionInfo = useSelector(selectCollectionInfo)

  const collection_addresses = useMemo(() => (
    collection_address_map
      ? Object.values(collection_address_map) as string[]
      : []
  ), [collection_address_map])

  const collection_addresses_sale = useMemo(() => (
    collectionInfo.address
      ? Object.values(collectionInfo.address) as string[]
      : []
  ), [collectionInfo.address])
  // order
  const order = useMemo(() => {
    if (orders?.length > 0 && nft) {
      return findOrder(orders, Number(nft.token_id), collection_addresses, isDetailPage)
    }
    return undefined
  }, [orders, nft, collection_addresses, isDetailPage])

  // highest bid
  const sortedBids = useMemo(() => {
    if (bidOrders?.length > 0 && nft) {
      const sortedBids = [...bidOrders]
        .filter(o => (collection_addresses.indexOf(o.collectionAddress) != -1
          && Number(nft.token_id) === Number(o.tokenId)))
        .sort((o1, o2) => {
          const p1 = BigNumber.from(o1.price)
          const p2 = BigNumber.from(o2.price)
          if (p1.eq(p2)) return 0
          return p2.sub(p1).isNegative() ? -1 : 1
        })
      return sortedBids
    }
    return undefined
  }, [bidOrders, collection_addresses])

  const highestBidOrder = (sortedBids && sortedBids.length > 0) ? sortedBids[0] : undefined
  const highestBidCoin = highestBidOrder?.currencyAddress && getCurrencyIconByAddress(highestBidOrder?.currencyAddress)
  const highestBidCurrencyName = getCurrencyNameAddress(highestBidOrder?.currencyAddress)
  const highestBid = Number(formatCurrency(highestBidOrder?.price || 0, highestBidCurrencyName))

  // last sale
  const lastSaleOrder = useMemo(() => {
    if (lastSaleOrders?.length > 0  && nft) {
      return findOrder(lastSaleOrders, Number(nft.token_id), collection_addresses_sale, isDetailPage)
    }
    return undefined
  }, [lastSaleOrders, nft, collection_addresses_sale, isDetailPage])
  const lastSaleCoin = lastSaleOrder?.currencyAddress && getCurrencyIconByAddress(lastSaleOrder?.currencyAddress)
  const lastSaleCurrencyName = getCurrencyNameAddress(lastSaleOrder?.currencyAddress)
  const lastSale = Number(formatCurrency(lastSaleOrder?.price || 0, lastSaleCurrencyName))

  const isListed = !!order
  const isAuction = order?.params?.[1] == SaleType.AUCTION
  return {
    order,
    orderChainId: order && Number(Object.keys(collection_address_map)[collection_addresses.indexOf(order.collectionAddress)]),
    isListed,
    isAuction,
    sortedBids,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  }
}

export default useOrderStatics
