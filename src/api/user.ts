import { GraphQLResponse } from '@/graphql/dataWrapper';
import { createUserMutation } from '@/graphql/mutations/createUser';
import { deleteUserByIdentifierMutation } from '@/graphql/mutations/deleteUserByIdentifier';
import { deleteTransactionMutation } from '@/graphql/mutations/deleteUserTransaction';
import { findUserByIdentifierQuery } from '@/graphql/queries/findUserByIdentifier';
import { getTransactionsCountByDateQuery } from '@/graphql/queries/getTransactionsByDate';
import { getTransactionsCountByCategoryQuery } from '@/graphql/queries/getTransactionsCountByCategory';
import { getUserBaseSalaryAndSumTransactionsAmountQuery } from '@/graphql/queries/getUserBaseSalaryAndSumTransactionsAmount';
import {
    CreateUserRequestDTO,
    FindUserByIdentifierResponse,
    TransactionsCountByCategory,
    TransactionsCountByDate,
    UserBaseSalaryAndTransactionsSum
} from '@/graphql/types';
import { axiosInstance } from '@/services/axios-instance';

export async function fetchUserData(userUid: string): Promise<GraphQLResponse<FindUserByIdentifierResponse>> {
    return await axiosInstance<GraphQLResponse<FindUserByIdentifierResponse>>({
        data: {
            query: findUserByIdentifierQuery,
            variables: {
                identifier: userUid
            }
        }
    });
}

export async function fetchTransactionsCountByCategory(userUid: string): Promise<GraphQLResponse<TransactionsCountByCategory>> {
    return await axiosInstance<GraphQLResponse<TransactionsCountByCategory>>({
        data: {
            query: getTransactionsCountByCategoryQuery,
            variables: {
                identifier: userUid
            }
        }
    });
}

export async function fetchTransactionsCountByDate(userUid: string): Promise<GraphQLResponse<TransactionsCountByDate>> {
    return await axiosInstance<GraphQLResponse<TransactionsCountByDate>>({
        data: {
            query: getTransactionsCountByDateQuery,
            variables: {
                identifier: userUid
            }
        }
    });
}

export async function fetchCreateUser(
    createUserRequestDTO: CreateUserRequestDTO
): Promise<GraphQLResponse<CreateUserRequestDTO>> {
    return await axiosInstance<GraphQLResponse<CreateUserRequestDTO>>({
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

export async function fetchDeleteUserAccount(userUid: string): Promise<Boolean> {
    return await axiosInstance<Boolean>({
        data: {
            query: deleteUserByIdentifierMutation,
            variables: {
                identifier: userUid
            }
        }
    });
}

export async function fetchUserBaseSalaryAndSumOfTransactionsAmount(
    userUid: string,
    month: number
): Promise<GraphQLResponse<UserBaseSalaryAndTransactionsSum>> {
    return await axiosInstance<GraphQLResponse<UserBaseSalaryAndTransactionsSum>>({
        data: {
            query: getUserBaseSalaryAndSumTransactionsAmountQuery,
            variables: {
                identifier: userUid,
                month
            }
        }
    });
}

export async function fetchDeleteUserTransaction(userUid: string, transactionId: string): Promise<Boolean> {
    return await axiosInstance<Boolean>({
        data: {
            query: deleteTransactionMutation,
            variables: {
                identifier: userUid,
                transactionId
            }
        }
    });
}
