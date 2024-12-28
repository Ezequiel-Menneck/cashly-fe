type Transaction = {
    id: string;
    amount: number;
    transactionDate: string;
    description: string;
    type: string;
    categoryId: string;
    categoryName: string;
};

type User = {
    id: string;
    identifier: string;
    username: string;
    baseSalary: number;
    transactions: Transaction[];
};

export type FindUserByIdentifierResponse = {
    findUserByIdentifier: User;
};
