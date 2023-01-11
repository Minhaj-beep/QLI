import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  LiveCourses: '',
  FeaturedCourses: '',
  PopularCourses: '',
  SearchData: '',
  SearchA: false,
  SearchT: '',
  SCData: '',
  LiveClassD:'',
  AssessmentData:'',
  Assessment:'',
  FullCourseData: '',
  AttendAssessment:'',
  SingleLiveCourse:'',
  LiveAssessmentList:'',
  LiveClassDetails:'',
};

export const courseSlice = createSlice({
  name: 'Course',
  initialState,
  reducers: {
    setLiveCourses: (state, action) => {
      state.LiveCourses = action.payload;
    },
    setFeaturedCourses: (state, action) => {
      state.FeaturedCourses = action.payload;
    },
    setPopularCourses: (state, action) => {
      state.PopularCourses = action.payload;
    },
    setSearchData: (state, action) => {
      state.SearchData = action.payload;
    },
    setSearchA: (state, action) => {
      state.SearchA = action.payload;
    },
    setSearchT: (state, action) => {
      state.SearchT = action.payload;
    },
    setSCData: (state, action) => {
      state.SCData = action.payload;
    },
    setLiveClassD: (state, action) => {
      state.LiveClassD = action.payload;
    },
    setAssessmentData: (state, action) => {
      state.AssessmentData = action.payload;
    },
    setAssessment:(state, action) => {
      state.Assessment = action.payload;
    },
    setFullCourseData: (state, action) => {
      state.FullCourseData = action.payload;
    },
    setAttendAssessment: (state, action) => {
      state.AttendAssessment = action.payload;
    },
    setSingleLiveCourse:(state, action) =>{
      state.SingleLiveCourse = action.payload;
    },
    setLiveAssessmentList:(state, action) =>{
      state.LiveAssessmentList = action.payload;
    },
    setLiveClassDetails:(state, action) =>{
      state.LiveClassDetails = action.payload;
    },
  },
});

export const {
  setSearchT,
  setSearchA,
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
  setSearchData,
  setSCData,
  setLiveClassD,
  setAssessmentData,
  setFullCourseData,
  setAttendAssessment,
  setSingleLiveCourse,
  setLiveAssessmentList,
  setLiveClassDetails,
} = courseSlice.actions;
export default courseSlice.reducer;
