export const deleteUserByIdentifierMutation = `
    mutation deleteUserByIdentifier($identifier: String!) {
        deleteUserByIdentifier(identifier: $identifier)
    }
`;
