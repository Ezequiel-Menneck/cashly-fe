export const updateBaseSalaryMutation = `
mutation updateUserBaseSalary($identifier: String!, $baseSalary: Float!) {
    updateUserBaseSalary(identifier: $identifier, baseSalary: $baseSalary) {
        id
        identifier
        baseSalary
    }
}
`;
