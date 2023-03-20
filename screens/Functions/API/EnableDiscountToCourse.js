/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const EnbleDiscountToCourse = async (email, list, id) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
    body: JSON.stringify({
        activeCourseList: list,
        discountId: id
    }),
  };
  const response = await fetch(
    BaseURL + '/v1/courseDiscount/enableDiscountToCourse',
    requestOptions,
  )
  return response.json();
};

export {EnbleDiscountToCourse};
