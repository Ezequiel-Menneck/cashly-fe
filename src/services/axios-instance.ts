import Axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_HOST;

export const AXIOS_INSTANCE = Axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        method: 'POST',
        ...config,
        cancelToken: source.token
    }).then(({ data }) => data);

    return promise;
};
