/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetDemoEnabledCourses = async (email) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
  };
  const response = await fetch(
    BaseURL + '/v1/live/course/getDemoEnabledCourses',
    requestOptions,
  );
  return response.json();
};

export {GetDemoEnabledCourses};