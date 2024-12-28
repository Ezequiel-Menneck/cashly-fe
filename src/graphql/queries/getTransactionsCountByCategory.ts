export const getTransactionsCountByCategoryQuery = `
    query getTransactionsCountByCategory($identifier: String!) {
        getTransactionsCountByCategory(identifier: $identifier) {
            categoryName
            transactionCount
        }
    }`;
