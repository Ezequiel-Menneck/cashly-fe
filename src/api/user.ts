import { findUserByIdentifierQuery } from '@/graphql/queries/findUserByIdentifier';
import { FindUserByIdentifierResponse } from '@/graphql/types';
import { axiosInstance } from '@/services/axios-instance';
import { useUID } from '../hooks/useUID';

export async function getUserData(): Promise<FindUserByIdentifierResponse> {
    return axiosInstance<FindUserByIdentifierResponse>({
        method: 'POST',
        data: {
            query: findUserByIdentifierQuery,
            variables: {
                identifier: useUID()
            }
        }
    });
}
