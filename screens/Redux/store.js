import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './Features/authSlice';
import CourseSlice from './Features/CourseSlice';
import InstructorSlice from './Features/InstructorSlice';
import loginSlice from './Features/loginSlice';
import userDataSlice from './Features/userDataSlice';
import oAuthSlice from './Features/oAuthSlice'

export const store = configureStore({
    reducer:{
        Auth:AuthSlice,
        Course:CourseSlice,
        Instructor:InstructorSlice,
        Login: loginSlice,
        UserData: userDataSlice,
        oAuth: oAuthSlice
    },
});
