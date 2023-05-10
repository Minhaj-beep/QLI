/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetReview = async (email, courseCode) => {
  // console.log(email + ' Rating ' + code);
  const requestOptions = {
    method: 'POST',
    // headers:{
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    //   'x-auth-token':UserD.JWT,
    // },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
    body: JSON.stringify({
        courseCode: courseCode,
    }),
  };
  const response = await fetch(
    // BaseURL + 'api/v1/course/' + 'ec7406a1-6ebe-420a-bc9d-4bc5e22370ce' + '/rating',
    BaseURL + 'courseReview',
    requestOptions,
  )
  // return 'yessssss';
  return response.json();
};

export {GetReview};
