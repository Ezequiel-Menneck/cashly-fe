export const findUserByIdentifierQuery = `
    query findUserByIdentifier($identifier: String!) {
        findUserByIdentifier(identifier: $identifier) {
            id
            identifier
            username
            baseSalary
            transactions {
                id
                amount
                transactionDate
                description
                type
                categoryId
                categoryName
            }
        }
    }
`;
