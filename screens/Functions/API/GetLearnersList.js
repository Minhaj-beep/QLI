/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetLearnersList = async (email, courseCode) => {
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
    BaseURL + '/eachCourseLearnersList?courseCode=' + courseCode,
    requestOptions,
  );
  return response.json();
};

export {GetLearnersList};