/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetCourseByCode = async (email, code) => {
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
    BaseURL + 'getCourseByCourseCode?courseCode=' + code,
    requestOptions,
  );
  return response.json();
};

export {GetCourseByCode};
