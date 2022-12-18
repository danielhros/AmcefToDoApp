// https://javascript.plainenglish.io/data-fetching-with-react-query-axios-257a95c86e77

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const client = axios.create({
  baseURL: "https://639b180fd5141501974ae966.mockapi.io",
  headers: {
    "Content-type": "application/json",
  },
});

const request = async function (options: AxiosRequestConfig) {
  const onSuccess = function (response: AxiosResponse) {
    const { data } = response;
    return data;
  };

  const onError = function (error: AxiosError) {
    return Promise.reject(error.response);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
