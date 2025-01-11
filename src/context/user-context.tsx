import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type UserUid = {
    uid: string;
};

type UserContextType = {
    userInfo: UserUid;
    updateUser: (newData: UserUid) => void;
};

const LOCAL_STORAGE_KEY = 'userInfo';

const initialState: UserUid = {
    uid: generateUserUID()
};

export function generateUserUID() {
    return Number(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserUid>(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : initialState;
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    }, [userData]);

    const updateUser = (newData: UserUid) => {
        setUserData(newData);
    };

    return <UserContext.Provider value={{ userInfo: userData, updateUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
