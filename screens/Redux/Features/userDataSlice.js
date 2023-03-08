import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
CourseData: '',
CCThumbImg:'',
CCIntroVideo:'',
CCOverview:'',
CCFAQ:'',
loading:false,
profileData:'',
SingleCD:'',
LessonData:null,
LData:null,
BankData:[],
SingleBD:'',
THistory:'',
BaseURL:'https://api.dev.qlearning.academy/'
}

export const userDataSlice = createSlice ({
    name: 'UData',
    initialState,
    reducers: {
        SetCourseData:(state, action) => {
            state.CourseData = action.payload;
        },
        // SetCourseCodes:(state, action) => {
        //     state.CourseCode = action.payload;
        // }
        setCCThumbImg:(state, action) => {
          state.CCThumbImg = action.payload;
        },
        setCCIntroVideo:(state, action) => {
          state.CCIntroVideo = action.payload;
        },
        setCCOverview:(state, action) => {
          state.CCOverview = action.payload;
        },
        setCCFAQ:(state, action) => {
          state.CCFAQ = action.payload;
        },
        setLoading:(state, action) => {
          state.loading = action.payload;
        },
        setProfileData:(state, action) => {
          state.profileData = action.payload;
        },
        setSingleCD:(state, action) => {
          state.SingleCD = action.payload;
        },
        setLessonData:(state, action) => {
          state.LessonData = action.payload;
        },
        setLData:(state, action) => {
          state.LData = action.payload
        },
        setBankData:(state, action) => {
          state.BankData = action.payload;
        },
        setTHistory:(state, action) => {
          state.THistory = action.payload;
        },
        setSingleBD:(state, action) => {
          state.SingleBD = action.payload
        }
    }
});

export const {setSingleBD,setTHistory,setBankData,setLData,setLessonData,setProfileData,SetCourseData,SetCourseCodes,setCCThumbImg,setCCIntroVideo,setCCOverview,setCCFAQ,setLoading,setSingleCD} = userDataSlice.actions;
export default userDataSlice.reducer;