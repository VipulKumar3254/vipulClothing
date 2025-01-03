import { createContext } from "react";


export const UserContext = createContext();

const UserProvider = ({ children }) => {
    
    return (
        <UserContext.Provider value={(user)}>
            {children}
        </UserContext.Provider>
    );
}

