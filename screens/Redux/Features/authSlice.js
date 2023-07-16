import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  LoggedIn: false,
  Loading: false,
  GUser: false,
  Mail: '',
  JWT: '',
  User_ID: '',
  ProfileData: '',
  ProfileImg: false,
  IsLoggedInBefore: false,
  HasAccountDeleted: false,
  IsLoggedInWithMobile: false,
  TempName: '',

};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.LoggedIn = action.payload;
    },
    setGUser: (state, action) => {
      state.GUser = action.payload;
    },
    setLoading: (state, action) => {
      state.Loading = action.payload;
    },
    setJWT: (state, action) => {
      state.JWT = action.payload;
    },
    setProfileData: (state, action) => {
      state.ProfileData = action.payload;
    },
    setMail: (state, action) => {
      state.Mail = action.payload;
    },
    setProfileImg: (state, action) => {
      state.ProfileImg = action.payload;
    },
    setUser_ID: (state, action) => {
      state.User_ID = action.payload;
    },
    setIsLoggedInBefore: (state, action) => {
      state.IsLoggedInBefore = action.payload;
    },
    setHasAccountDeleted: (state, action) => {
      state.HasAccountDeleted = action.payload;
    },
    setIsLoggedInWithMobile: (state, action) => {
      state.IsLoggedInWithMobile = action.payload;
    },
    setTempName: (state, action) => {
      state.TempName = action.payload;
    },
  },
});

export const {
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
  setProfileImg,
  setMail,
  setProfileData,
  setJWT,
  setLoggedIn,
  setGUser,
  setLoading,
  setUser_ID,
  setIsLoggedInBefore,
  setHasAccountDeleted,
  setIsLoggedInWithMobile,
  setTempName
} = authSlice.actions;
export default authSlice.reducer;
