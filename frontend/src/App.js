import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Post from "./Post";
import Home from "./Home";

export default function App() {
  const [titles, setTitles] = useState([]);

  const fetchData = () => {
    axios
      .get("https://paul.deta.dev/posts")
      .then((res) => {
        setTitles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(fetchData, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home titles={titles} />
          </Route>
          {titles.map(({ id }) => (
            <Route key={id} path={"/posts/" + id} render={() => <Post id={id} />} />
          ))}
          <Route path="*">
            <Home titles={titles} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
