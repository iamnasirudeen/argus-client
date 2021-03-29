import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Auth from "./Auth";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";
import { SocketContextProvider } from "./socket";
import { AuthContextProvider, AuthContext } from "./AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <SocketContextProvider>
          <Switch>
            <Route exact path="/auth" component={Auth} />
            <PrivateRoute exact path="*" component={App} />
          </Switch>
        </SocketContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function PrivateRoute({ path, exact, component }) {
  const { authenticationStatus } = useContext(AuthContext);
  const [isLoggedIn, setLoginStatus] = useState(null);

  useEffect(() => {
    const positiveState =
      localStorage.getItem("argus::authentication") !== null &&
      localStorage.getItem("argus::authentication") === "true";

    setLoginStatus(positiveState);
  }, []);

  return (
    <>
      {authenticationStatus ? (
        isLoggedIn ? (
          <Route path={path} exact={exact} component={component} />
        ) : (
          <Redirect to="/auth" />
        )
      ) : (
        <Route path={path} exact={exact} component={component} />
      )}
    </>
  );
}
