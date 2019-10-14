const mocks = [require("./loginMock"), require("./defaultMock")];

let mockResponse;

export default {
  mockResponse: resp => (mockResponse = resp),
  request: apiRequestParams => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let mock = mocks.find(m => m.default.request(apiRequestParams)).default;
        let { data, status = 200, headers } =
          mockResponse || mock.response(apiRequestParams);
        if (status >= 200 && status < 400) {
          resolve({ data, status, headers });
        } else {
          const error = Error();
          error.response = { data, status, headers };
          reject(error);
        }
      }, 1000);
    });
  }
};
