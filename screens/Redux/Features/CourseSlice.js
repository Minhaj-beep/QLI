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
  Assessment:false,
  FullCourseData: '',
  AttendAssessment:'',
  SingleLiveCourse:'',
  LiveAssessmentList:'',
  LiveClassDetails:'',
  LiveCourseLiveObject:'',
  CurrentLiveCourseCode:null,
  GoLiveDemoObject: {},
  UpcomingClassData: [],
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
    setLiveCourseLiveObject:(state, action) =>{
      state.LiveCourseLiveObject = action.payload;
    },
    setCurrentLiveCourseCode:(state, action) =>{
      state.CurrentLiveCourseCode = action.payload;
    },
    setCurrentDemoClassObject:(state, action) =>{
      state.CurrentDemoClassObject = action.payload;
    },
    setCurrentDemoClassCourseCode:(state, action) =>{
      state.CurrentDemoClassCourseCode = action.payload;
    },
    setGoLiveDemoObject:(state, action) =>{
      state.GoLiveDemoObject = action.payload;
    },
    setUpcomingClassData:(state, action) =>{
      state.UpcomingClassData = action.payload;
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
  setAssessment,
  setFullCourseData,
  setAttendAssessment,
  setSingleLiveCourse,
  setLiveAssessmentList,
  setLiveClassDetails,
  setLiveCourseLiveObject,
  setCurrentLiveCourseCode,
  setCurrentDemoClassObject,
  setCurrentDemoClassCourseCode,
  setGoLiveDemoObject,
  setUpcomingClassData
} = courseSlice.actions;
export default courseSlice.reducer;
