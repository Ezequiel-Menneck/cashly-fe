export const getTransactionsCountByDateQuery = `
    query getTransactionsCountByDate($identifier: String!) {
        getTransactionsCountByDate(identifier: $identifier) {
            transactionCount
            date
        }
}
`;
