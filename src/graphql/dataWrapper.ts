type ErrorExtension = {
    errorCode: string;
};

type GraphQLError = {
    message: string;
    locations: any[];
    extensions: ErrorExtension;
};

export type GraphQLResponse<T> = {
    data: T | null;
    errors?: GraphQLError[];
};
