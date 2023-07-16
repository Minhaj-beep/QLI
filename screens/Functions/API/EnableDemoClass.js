/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const EnableDemoClass = async (email, code) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
    body: JSON.stringify({
        courseCode: code,
        isDemo: true,
    }),
  };
  const response = await fetch(
    BaseURL + 'v1/live/course/enableDemo',
    requestOptions,
  )
  return response.json();
};

export {EnableDemoClass};
