/*
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation} from "@apollo/client";
import React from "react"
import { Container, Row, Col, FormInput, Button } from "shards-react";

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

/!*Helper function helps with managing string templates filled with graphql query language code*!/
const GET_MESSAGES = gql`
     query {
        messages {
            id
            content
            user
        }
    }
`;

const POST_MESSAGE = gql`
    mutation($user: String!, $content: String!) {
        postMessage(user: $user, content: $content)
    }
`;

const Messages = ({ user }) => {
    const {data} = useQuery(GET_MESSAGES, {
        pollInterval:500,
    });
    if (!data) {
        return null;
    }
    return(
        <>
            {data.messages.map(({ id, user: messageUser, content }) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: user === messageUser ? "flex-end" : "flex-start",
                        paddingBottom: "1em",
                    }}
                >
                    {user !== messageUser && (
                        <div style={{
                            height: 50,
                            width: 50,
                            marginRight: "0.5em",
                            border: "2px solid #e5e6ea",
                            borderRadius: 25,
                            textAlign: "center",
                            fontSize: "18pt",
                            paddingTop: 5,
                        }}>
                            {messageUser.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div style={{
                        background:user === messageUser ? "#58bf56" : "#e5e6ea",
                        color: user === messageUser ? "white"  : "Black",
                        padding:"1em",
                        borderRadius:"20%",
                        maxWidth:"60%",
                    }}>
                        {content}
                    </div>
                </div>
            ))}
        </>
    )
};


const Chat = () => {
    const [state, stateSet] = React.useState({
        user: "Jack",
        content: "",
    });

    const [postMessage] = useMutation(POST_MESSAGE)

    const onSend = () =>{
        if(state.content.length > 0) {
            postMessage({
                variables: state,
            });
        }
        stateSet({
            ...state,
            content: "",
        });
    }

    return (
      <Container>
          <Messages user="Mary" />
          <Row>
              <Col xs={2} style={{ padding: 0 }}>
                  <FormInput
                      label="User"
                      value={state.user}
                      onChange={(evt) =>
                          stateSet({
                              ...state,
                              user: evt.target.value,
                          })
                      }
                  />
              </Col>
              <Col xs={8}>
                  <FormInput
                      label="Content"
                      value={state.content}
                      onChange={(evt) =>
                          stateSet({
                              ...state,
                              content: evt.target.value,
                          })
                      }
                      onKeyUp={(evt) => {
                          if (evt.keyCode === 13) {
                              onSend();
                          }
                      }}
                  />
              </Col>
              <Col xs={2} style={{ padding: 0 }}>
                  <Button onClick={() => onSend()} style={{ width: "100%" }}>
                      Send
                  </Button>
              </Col>
          </Row>
      </Container>
    )
}

export default () => (
    <ApolloProvider client={client}>
        <Chat/>
    </ApolloProvider>
)

*/

import React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useSubscription,
    useMutation,
    gql, useQuery,
} from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import {Container, Row, Col, FormInput, Button} from "shards-react";

const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true,
    },
});

const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
    subscription {
        messages {
            id
            content
            user
        }
    }
`;

const POST_MESSAGE = gql`
    mutation($user: String!, $content: String!) {
        postMessage(user: $user, content: $content)
    }
`;

const Messages = ({user}) => {
    const {data} = useSubscription(GET_MESSAGES);
    if (!data) {
        return null;
    }

    return (
        <>
            {data.messages.map(({id, user: messageUser, content}) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: user === messageUser ? "flex-end" : "flex-start",
                        paddingBottom: "1em",
                        paddingLeft:"20px",
                    }}
                >
                    {user !== messageUser && (
                        <div
                            className="bg-blue-700"
                            style={{
                                height: 50,
                                width: 50,
                                marginRight: "0.5em",
                                border: "1px solid lightgrey",
                                borderRadius: 25,
                                textAlign: "center",
                                fontSize: "12pt",
                                display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                color:"white",
                                letterSpacing: "1px",

                            }}
                        >
                            {messageUser.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div
                        style={{
                            background: user === messageUser ? "#fd7878" : "#e5e6ea",
                            color: user === messageUser ? "#ffffff" : "black",
                           display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            fontWeight:"normal",
                            letterSpacing:"0.3px",
                            padding:"0.8em",
                            borderRadius: "1em",
                            maxWidth: "60%",
                        }}
                    >
                        {content}
                    </div>
                </div>
            ))}
        </>
    );
};

const Chat = () => {
    const [state, stateSet] = React.useState({
        user: "Jack",
        content: "",
    });
    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () => {
        if (state.content.length > 0) {
            postMessage({
                variables: state,
            });
        }
        stateSet({
            ...state,
            content: "",
        });
    };
    return (
        <div className="container_wrapper">
            <Container className="container_shadow" style={{paddingTop:"50px", paddingBottom:"50px", overflow:"scroll", paddingRight:"40px"}}>
                <Messages user={state.user}/>
                <Row style={{paddingLeft:"40px", paddingRight:"20px", paddingTop:"20px"}}>
                    <Col xs={2} style={{padding: 0}}>
                        <FormInput
                            label="User"
                            style={{borderStyle:"none", outline:"none", borderRadius:"20px"}}
                            value={state.user}
                            onChange={(evt) =>
                                stateSet({
                                    ...state,
                                    user: evt.target.value,
                                })
                            }
                        />
                    </Col>
                    <Col xs={8} >
                        <FormInput
                            label="Content"
                            style={{borderStyle:"none", outline:"none", borderRadius:"20px"}}
                            value={state.content}
                            onChange={(evt) =>
                                stateSet({
                                    ...state,
                                    content: evt.target.value,
                                })
                            }
                            onKeyUp={(evt) => {
                                if (evt.keyCode === 13) {
                                    onSend();
                                }
                            }}
                        />
                    </Col>
                    <Col xs={2} style={{padding: 0}}>
                        <Button onClick={() => onSend()} style={{width: "100%", }}>
                            Send
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default () => (
    <ApolloProvider client={client}>
        <Chat/>
    </ApolloProvider>
);
