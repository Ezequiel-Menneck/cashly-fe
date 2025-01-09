export const createCategoryMutation = `
mutation createCategory($name: String!) {
    createCategory(name: $name) {
        id
        name
    }
}
`;
