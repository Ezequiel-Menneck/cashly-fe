export const deleteTransactionMutation = `
    mutation deleteTransaction($identifier: String!, $transactionId: String!) {
        deleteTransaction(identifier: $identifier, transactionId: $transactionId)
    }
`;
