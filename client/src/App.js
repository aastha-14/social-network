import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Route exact path="/">
          <Landing />
        </Route>
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Router>
    </div>
  );
};

export default App;
