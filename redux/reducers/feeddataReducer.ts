import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { getPriceFeeddata, getGasOnChains } from '../../services/datafeed'

//reducers
export const feeddataSlice = createSlice({
	name: 'feeddata',
	initialState: {
        assetPrices:{},
		gasPrices:{}
	},
	reducers: {
        setAssetPrices: (state, action) => {
            state.assetPrices = action.payload === undefined ? 0 : action.payload
        },
		setGasPrices: (state, action) => {
            state.gasPrices = action.payload === undefined ? 0 : action.payload
        }
	}
})

//actions
export const { setAssetPrices, setGasPrices } = feeddataSlice.actions
export const getAssetPrices = () => async (dispatch: Dispatch<any>) => {
	try {
		const info = await getPriceFeeddata()
		dispatch(setAssetPrices(info))
	} catch (error) {
		console.log("getFeeddata error ? ", error)
	}
}
export const getGasPrices = () => async (dispatch: Dispatch<any>) => {
	try {
		const info = await getGasOnChains()
		dispatch(setGasPrices(info))
	} catch (error) {
		console.log("getGasPrices error ? ", error)
	}
}
//selectors

export const selectAssetPrices = (state: any) => state.feeddataState.assetPrices
export const selectGasPrices = (state: any) => state.feeddataState.gasPrices

export default feeddataSlice.reducer