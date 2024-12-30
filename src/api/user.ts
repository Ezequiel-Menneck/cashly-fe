import { findUserByIdentifierQuery } from '@/graphql/queries/findUserByIdentifier';
import { getTransactionsCountByDateQuery } from '@/graphql/queries/getTransactionsByDate';
import { getTransactionsCountByCategoryQuery } from '@/graphql/queries/getTransactionsCountByCategory';
import {
    FindUserByIdentifierResponse,
    TransactionsCountByCategory,
    TransactionsCountByDate
} from '@/graphql/types';
import { axiosInstance } from '@/services/axios-instance';
import { useUID } from '../hooks/useUID';

const variables = {
    identifier: useUID()
};

export async function fetchUserData(): Promise<FindUserByIdentifierResponse> {
    return axiosInstance<FindUserByIdentifierResponse>({
        data: {
            query: findUserByIdentifierQuery,
            variables
        }
    });
}

export async function fetchTransactionsCountByCategory(): Promise<TransactionsCountByCategory> {
    return axiosInstance<TransactionsCountByCategory>({
        data: {
            query: getTransactionsCountByCategoryQuery,
            variables
        }
    });
}

export async function fetchTransactionsCountByDate(): Promise<TransactionsCountByDate> {
    return axiosInstance<TransactionsCountByDate>({
        data: {
            query: getTransactionsCountByDateQuery,
            variables
        }
    });
}
