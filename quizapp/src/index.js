import React from "react";
import { render } from "react-dom";
import Main from "./components/Main";
import * as serviceWorker from "./serviceWorker";

import "./styles/app.css";
import "bootstrap/dist/css/bootstrap.min.css";

render(<Main />, document.getElementById("root"));

serviceWorker.unregister();
