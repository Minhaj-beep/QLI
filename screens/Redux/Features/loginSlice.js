import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = { 
    Name:'',
    email:'',
    password:'',
    UserImage:'',
    ProfileImg:false,
    userType: 'INSTRUCTOR',
    GUser:false,
    login_Status:false,
    JWT: '',
    NCount:null,
    isNotificationReady: false,
    isDiscountModalOpen: false,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setName:(state, action) =>{
            state.Name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setLogin_Status: (state, action) => {
            state.login_Status = action.payload;
        },
        resetLoginData: (state, action) => {
            state => initialState;
        },
        setJWT:(state, action) => {
            state.JWT = action.payload;
        },
        setGUser:(state, action)=>{
            state.GUser = action.payload;
        },
        setUserImage:(state, action) => {
            state.UserImage = action.payload;
        },
        setProfileImg:(state, action) => {
            state.ProfileImg = action.payload;
        },
        setNCount:(state, action) => {
            state.NCount = action.payload;
        },
        setIsNotificationReady:(state, action) => {
            state.isNotificationReady = action.payload;
        },
        setIsDiscountModalOpen:(state, action) => {
            state.isDiscountModalOpen = action.payload;
        },
    }
});



export const {setIsDiscountModalOpen, setNCount,setProfileImg,setUserImage,setGUser,setName,setEmail, setIsNotificationReady, setPassword, setLogin_Status, resetLoginData, setJWT} = loginSlice.actions;
export default loginSlice.reducer;