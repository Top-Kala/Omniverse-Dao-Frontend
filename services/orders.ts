import { IGetOrderRequest,IAcceptOrderRequest } from "../interface/interface"
import { MakerOrderWithSignature } from "../types"
import API from "./api"

const createOrder = async (data: MakerOrderWithSignature) => {
    const res = await API.post("orders", data)
    return res.data.data
}

const getOrders = async (request: IGetOrderRequest) => {
    const res = await API.get("orders", {
        params: request
    })
    return res.data
}

const acceptOrder = async (request: IAcceptOrderRequest) => {
    const res = await API.post("orders/changeOrderStatus", {
        params: request
    })
    return res.data
}


export const orderService = {
    createOrder,
    getOrders,
    acceptOrder
}