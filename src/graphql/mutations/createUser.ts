export const createUserMutation = `
    mutation createUser($identifier: String!, $baseSalary: Float!) {
        createUser(createUserRequest: { identifier: $identifier, baseSalary: $baseSalary }) {
            identifier
            baseSalary
        }
    }
`;
