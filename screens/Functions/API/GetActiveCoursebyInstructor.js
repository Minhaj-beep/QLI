import {BaseURL} from '../../StaticData/Variables';

const GetActiveCoursebyInstructor = async (email) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email
    },
  };
  const response = await fetch(
    BaseURL + '/getActiveCoursebyInstructor',
    requestOptions,
  )
  return response.json();
};

export {GetActiveCoursebyInstructor};
