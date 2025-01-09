import { GraphQLResponse } from '@/graphql/dataWrapper';
import { createCategoryMutation } from '@/graphql/mutations/createCategory';
import { createTransactionMutation } from '@/graphql/mutations/createTransaction';
import { createUserMutation } from '@/graphql/mutations/createUser';
import { deleteUserByIdentifierMutation } from '@/graphql/mutations/deleteUserByIdentifier';
import { deleteTransactionMutation } from '@/graphql/mutations/deleteUserTransaction';
import { updateTransactionMutation } from '@/graphql/mutations/updateTransaction';
import { findAllCategoryQuery } from '@/graphql/queries/findAllCategory';
import { findUserByIdentifierQuery } from '@/graphql/queries/findUserByIdentifier';
import { getTransactionsCountByDateQuery } from '@/graphql/queries/getTransactionsByDate';
import { getTransactionsCountByCategoryQuery } from '@/graphql/queries/getTransactionsCountByCategory';
import { getUserBaseSalaryAndSumTransactionsAmountQuery } from '@/graphql/queries/getUserBaseSalaryAndSumTransactionsAmount';
import {
    CategoryNameAndIdList,
    CreateCategoryDTO,
    CreateTransactionDTO,
    CreateUserRequestDTO,
    FindUserByIdentifierResponse,
    TransactionsCountByCategory,
    TransactionsCountByDate,
    UpdateTransactionDTO,
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

export async function fetchGetAllCategories(): Promise<GraphQLResponse<CategoryNameAndIdList>> {
    return await axiosInstance<Promise<GraphQLResponse<CategoryNameAndIdList>>>({
        data: {
            query: findAllCategoryQuery
        }
    });
}

export async function fetchUpdateTransaction(updateTransactionDTO: UpdateTransactionDTO): Promise<Boolean> {
    return await axiosInstance<Promise<Boolean>>({
        data: {
            query: updateTransactionMutation,
            variables: {
                identifier: updateTransactionDTO.identifier,
                transactionId: updateTransactionDTO.transactionId,
                amount: updateTransactionDTO.amount,
                transactionDate: updateTransactionDTO.transactionDate,
                description: updateTransactionDTO.description,
                type: updateTransactionDTO.type,
                categoryName: updateTransactionDTO.identifier
            }
        }
    });
}

export async function fetchCreateTransaction(createTransactionDTO: CreateTransactionDTO): Promise<GraphQLResponse<Boolean>> {
    return await axiosInstance<Promise<GraphQLResponse<Boolean>>>({
        data: {
            query: createTransactionMutation,
            variables: {
                identifier: createTransactionDTO.identifier,
                amount: createTransactionDTO.amount,
                transactionDate: createTransactionDTO.transactionDate,
                description: createTransactionDTO.description,
                type: createTransactionDTO.type,
                categoryName: createTransactionDTO.identifier
            }
        }
    });
}

export async function fetchCreateCategory(createCategoryDTO: CreateCategoryDTO): Promise<GraphQLResponse<Boolean>> {
    return await axiosInstance<Promise<GraphQLResponse<Boolean>>>({
        data: {
            query: createCategoryMutation,
            variables: {
                name: createCategoryDTO.name
            }
        }
    });
}
