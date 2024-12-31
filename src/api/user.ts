import { createUserMutation } from '@/graphql/mutations/createUser';
import { findUserByIdentifierQuery } from '@/graphql/queries/findUserByIdentifier';
import { getTransactionsCountByDateQuery } from '@/graphql/queries/getTransactionsByDate';
import { getTransactionsCountByCategoryQuery } from '@/graphql/queries/getTransactionsCountByCategory';
import {
    CreateUserRequestDTO,
    FindUserByIdentifierResponse,
    TransactionsCountByCategory,
    TransactionsCountByDate
} from '@/graphql/types';
import { axiosInstance } from '@/services/axios-instance';
import { useUserInfo } from '../hooks/useUserInfo';

const variables = {
    identifier: useUserInfo().uid
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

export async function fetchCreateUser(createUserRequestDTO: CreateUserRequestDTO): Promise<CreateUserRequestDTO> {
    return axiosInstance<CreateUserRequestDTO>({
        data: {
            query: createUserMutation,
            variables: {
                username: createUserRequestDTO.username,
                identifier: createUserRequestDTO.identifier,
                baseSalary: createUserRequestDTO.baseSalary
            }
        }
    });
}
