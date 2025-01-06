export const getUserBaseSalaryAndSumTransactionsAmountQuery = `
    query getUserBaseSalaryAndSumTransactionsAmount($identifier: String!, $month: Int!) {
        getUserBaseSalaryAndSumTransactionsAmount(identifier: $identifier, month: $month) {
            baseSalary
            transactionsAmountSum
        }
    }`;
