import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    accessToken: '',
    OResponse: [],
}

export const oAuthSlice = createSlice({
    name: 'oAuth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setResponse: (state, action) => {
            state.OResponse = action.payload;
        }       
    }
});

export const { setAccessToken,setResponse } = oAuthSlice.actions;
export default oAuthSlice.reducer;