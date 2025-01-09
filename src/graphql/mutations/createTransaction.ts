export const createTransactionMutation = `
mutation createTransaction(
    $identifier: String!,
    $amount: Float!,
    $description: String!,
    $type: String!,
    $transactionDate: String!,
    $categoryName: String
) {
    createTransaction(
        createTransactionDTO: {
            identifier: $identifier,
            amount: $amount,
            description: $description,
            type: $type,
            transactionDate: $transactionDate,
            categoryName: $categoryName
        }
    ) {
        id
        amount
        description
        type
        categoryId
    }
}
`;
