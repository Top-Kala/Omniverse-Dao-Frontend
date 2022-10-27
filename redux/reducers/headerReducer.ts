import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

//reducers
export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        searchText: '',
    },
    reducers: {
		setSearchText: (state, action) => {
            state.searchText = action.payload === undefined ? '' : action.payload
        }
    }
})

//actions
export const { setSearchText } = headerSlice.actions

export const getSearchText = (text: string) => async (dispatch: Dispatch<any>) => {
    dispatch(setSearchText(text))
}
//selectors
export const selectSearchText = (state: any) => state.headerState.searchText

export default headerSlice.reducer