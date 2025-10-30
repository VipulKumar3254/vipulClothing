"use client"
import { createContext,useState } from "react";

// context for setting user globally 
export const userContext = createContext()
//  context for filtering products based on the critera in Filter.jsx
export const filterContext  = createContext();


export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}