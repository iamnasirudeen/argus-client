import { createContext, useState, useEffect } from "react";
import { Redirect } from "react-router";
import App from "./App";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authenticationStatus, setAuthenticationStatus] = useState(null);
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/logs/"
      : window.location.pathname;

  useEffect(() => {
    async function fetchConfig() {
      const requireAuthentication = await (
        await fetch(`${baseURL}api/logs/config`)
      ).json();

      console.log(requireAuthentication);

      setAuthenticationStatus(requireAuthentication?.authentication);
    }

    (async () => await fetchConfig())();
  }, [baseURL]);

  return (
    <AuthContext.Provider value={{ authenticationStatus }}>
      {authenticationStatus === null
        ? "Loading..."
        : authenticationStatus === false
        ? children
        : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
