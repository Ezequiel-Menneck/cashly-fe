import { generateUserUID } from './ useFirstTimeCheck';

export function useUserInfo(): UserUidAndUsername {
    const jsonUserInfo = localStorage.getItem('userINFO');
    if (!jsonUserInfo) {
        return { uid: generateUserUID(), username: '' };
    }
    return JSON.parse(jsonUserInfo);
}

export function useSaveUserInfo(info: UserUidAndUsername) {
    const stringData = JSON.stringify(info);
    localStorage.setItem('userINFO', stringData);
}

export type UserUidAndUsername = {
    uid: string;
    username?: string;
};
