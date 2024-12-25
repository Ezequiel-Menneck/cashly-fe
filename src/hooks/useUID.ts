export function useUID(): string | null {
    return localStorage.getItem('userUID');
}
