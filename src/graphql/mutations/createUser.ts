export const createUserMutation = `
    mutation createUser($username: String!, $identifier: String!, $baseSalary: Float!) {
        createUser(createUserRequest: { username: $username, identifier: $identifier, baseSalary: $baseSalary }) {
            identifier
            username
            baseSalary
        }
    }
`;
