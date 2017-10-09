import ext from "./utils/ext";
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app.js'
import './libs/bmob.js'
Bmob.initialize("4ab522b6e62dd3251a04a454b211a0af", "181e05d4d86b44fab465140e8c85d3bc");

ReactDOM.render(<App></App>, document.getElementById("root"))

