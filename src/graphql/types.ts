export type Transaction = {
    id: string;
    amount: number;
    transactionDate: string;
    description: string;
    type: string;
    categoryId: string;
    categoryName: string;
};

export type User = {
    id: string;
    identifier: string;
    username: string;
    baseSalary: number;
    transactions: Transaction[];
};

export type FindUserByIdentifierResponse = {
    findUserByIdentifier: User;
};

type CategoryNameAndTransactionsCount = {
    categoryName: string;
    transactionCount: number;
};

export type DateOfTransactionsAndTransactionsCount = {
    date: string;
    transactionCount: number;
};

export type TransactionsCountByCategory = {
    getTransactionsCountByCategory: CategoryNameAndTransactionsCount[];
};

export type TransactionsCountByDate = {
    getTransactionsCountByDate: DateOfTransactionsAndTransactionsCount[];
};

export type CreateUserRequestDTO = {
    username: string;
    identifier: string;
    baseSalary: number;
};

export type UpdateTransactionDTO = {
    transactionId: string;
    identifier: string;
    amount: number;
    transactionDate: Date;
    description: string;
    type: TransactionType;
    categoryName: string | null;
};

export type CreateTransactionDTO = {
    identifier: string;
    amount: number;
    transactionDate: Date;
    description: string;
    type: TransactionType;
    categoryName: string | null;
};

export type TransactionType = 'CREDIT' | 'DEBIT';

type UserBaseSalaryAndSumTransactionsAmount = {
    baseSalary: number;
    transactionsAmountSum: number;
};

export type UserBaseSalaryAndTransactionsSum = {
    getUserBaseSalaryAndSumTransactionsAmount: UserBaseSalaryAndSumTransactionsAmount;
};

type CategoryNameAndId = {
    id: string;
    name: string;
};

export type CategoryNameAndIdList = {
    findAll: CategoryNameAndId[];
};
