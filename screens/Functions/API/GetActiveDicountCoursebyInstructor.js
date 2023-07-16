import {BaseURL} from '../../StaticData/Variables';

const GetActiveDicountCoursebyInstructor = async (email, id) => {
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
    BaseURL + 'v1/courseDiscount/getActiveDicountCoursebyInstructor?discountId=' + id,
    requestOptions,
  )
  return response.json();
};

export {GetActiveDicountCoursebyInstructor};
