import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Container } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import Chat from "chat/Chat.js"


const App = () => (

        <Container>

            <h1>Chat!</h1>
            <Chat />

        </Container>
);

ReactDOM.render(<App />, document.getElementById("app"));
