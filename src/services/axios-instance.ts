import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
    baseURL: 'http://localhost:8080/graphql',
    headers: {
        'Content-Type': 'application/json' // Required for GraphQL
    }
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        cancelToken: source.token
    }).then(({ data }) => data.data);

    return promise;
};
