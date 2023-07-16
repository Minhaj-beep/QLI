/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetDemoEnabledCourses = async (header) => {
  const requestOptions = {
    method: 'GET',
    headers: header,
  };
  const response = await fetch(
    BaseURL + 'v1/live/course/getDemoEnabledCourses',
    requestOptions,
  );
  return response.json();
};

export {GetDemoEnabledCourses};