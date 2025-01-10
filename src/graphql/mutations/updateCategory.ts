export const updateCategoryMutation = `
mutation updateCategory($oldName: String!, $newName: String!) {
    updateCategory(updateCategoryDTO: {oldName: $oldName, newName: $newName}) {
        id
        name
    }
}
`;
