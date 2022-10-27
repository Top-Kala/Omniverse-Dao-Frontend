import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { userService } from '../../services/users'
import { openSnackBar } from './snackBarReducer'
import {GregContractAddress} from '../../constants/addresses'

//reducers
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        updatingUser: false,
        gettingUser: true,
        user: {},
        nfts: [],
        isGregHolder:false,
        heroSkin:'logo',
        refreshBalance: 0
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setUpdatingUser: (state, action) => {
            state.updatingUser = action.payload === undefined ? false : action.payload
        },
        setGettingUser: (state, action) => {
            state.gettingUser = action.payload === undefined ? false : action.payload
        },
        setUserNFTs: (state, action) => {
            state.nfts = action.payload === undefined ? [] : action.payload
        },
        setIsGregHolder: (state, action) => {
            state.isGregHolder = action.payload === undefined?false : action.payload
        },
        setHeroSkin: (state, action) => {
            state.heroSkin = action.payload === undefined?false : action.payload
        },
        updateRefreshBalance: (state) => {
            state.refreshBalance = (state.refreshBalance || 0) + 1
        }
    }
})

//actions
export const { setUser, setUpdatingUser, setGettingUser, setUserNFTs, setIsGregHolder, setHeroSkin, updateRefreshBalance } = userSlice.actions

export const getUser = (address: string) => async (dispatch: Dispatch<any>) => {
    dispatch(setGettingUser(true))
    try {
        const user = await userService.getUserByAddress(address)
        dispatch(setUser(user))
        if(user.greg){
           // dispatch(setHeroSkin(user.greg))
        }
        
        dispatch(setGettingUser(false))
    } catch (error) {
        //dispatch(setUser({}))
        dispatch(setGettingUser(false))
    }
}

export const updateUser = (user: FormData) => async (dispatch: Dispatch<any>) => {
    dispatch(setUpdatingUser(true))

    try {
        dispatch(openSnackBar({ message: 'Updating User Profile...', status: 'info' }))
        await userService.updateProfile(user)
        dispatch(setUpdatingUser(false))
        dispatch(setUser(user))
        dispatch(openSnackBar({ message: 'Successfully updated', status: 'success' }))
    } catch (error: any) {
        dispatch(setUpdatingUser(false))
        dispatch(openSnackBar({ message: error.message, status: 'error' }))
    }
}

export const getUserNFTs = (address: string) => async (dispatch: Dispatch<any>) => {
    try {
        const nfts = await userService.getUserNFTs(address)
        nfts.map((nft:any)=>{
            if(nft.token_address===GregContractAddress[nft.chain]){
                dispatch(setIsGregHolder(true))
            }            
        })
        dispatch(setUserNFTs(nfts))
    } catch (error) {
    }
}
export const updateIsGregHolder = (flag: boolean) => async (dispatch: Dispatch<any>) => {
    try {
       
        dispatch(setIsGregHolder(flag))
    } catch (error) {
        console.log("failed to update Isgregholder")
    }
}
export const updateHeroSkin = (name: String) => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(setHeroSkin(name))
    } catch (error) {
        console.log("failed to update heroSkin")
    }
}

//selectors
export const selectUser = (state: any) => state.userState.user
export const selectUpdatingUser = (state: any) => state.userState.updatingUser
export const selectGettingUser = (state: any) => state.userState.gettingUser
export const selectUserNFTs = (state: any) => state.userState.nfts
export const selectIsGregHolder = (state: any) => state.userState.isGregHolder
export const selectHeroSkin = (state: any) => state.userState.heroSkin
export const selectRefreshBalance = (state: any) => state.userState.refreshBalance

export default userSlice.reducer
