export const updateTransactionMutation = `
    mutation updateTransaction(
        $identifier: String!,
        $transactionId: String!,
        $amount: Float!,
        $transactionDate: String!,
        $description: String!,
        $type: String!,
        $categoryName: String!
    ) {
        updateTransaction(
            updateTransactionDTO: {
                identifier: $identifier,
                transactionId: $transactionId,
                amount: $amount,
                transactionDate: $transactionDate,
                description: $description,
                type: $type,
                categoryName: $categoryName
            }
        )
    }
`;
