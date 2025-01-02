import { GraphQLResponse } from '@/graphql/dataWrapper';
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
