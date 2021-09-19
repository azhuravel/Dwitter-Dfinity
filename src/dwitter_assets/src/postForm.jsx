import React, { useState, useEffect } from 'react';
import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthClient } from "@dfinity/auth-client";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { useEffect } from 'react';

export const PostForm = (props) => {
    const [charRemains, setCharRemains] = useState(140);
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [actor, setActor] = useState(null);
  
    useEffect(() => {
        async function fetchActor() {
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();
            const dwitterActor = createActor(canisterId, {
                agentOptions: {
                    identity,
                },
            });
            setActor(dwitterActor);
        }
        fetchActor();
    }, []);

    useEffect(() => {
        fetchData();
    }, [actor]);
  
    async function post() {
      setPosting(true);
      const post = {
        text : text
      }
      setPostText("");
      const response = await actor.savePost(post);
      console.log(response);
      fetchData();
      setPosting(false);
    }
  
    async function fetchData() {
      setLoading(true);
      const response = await actor?.getPosts();
      setPosts(response ? (response[0] || []) : []);
      setLoading(false);
    }
  
    function handleTextChange(e) {
      let val = e.target.value;
      setPostText(val);
    }

    function setPostText(text) {
      setText(text);
      setCharRemains(140 - text.length);
    }
  
    return (
      <Container style={props.style}>
          <Row>
            <Col>
                <FormControl as="textarea" aria-label="Text" value={text} onChange={e => handleTextChange(e)} maxLength="140"/>
            </Col>
          </Row>
          <Row>
            <Col>
                <p>Characters remains: {charRemains}</p>
            </Col>
          </Row>
          <Row>
            <Col>
                <Button variant="primary" onClick={post} disabled={posting}>Publish</Button>
            </Col>
          </Row>
          <Row>
            <Col>
                {loading ? "Loading..." : ""}
            </Col>
          </Row>
          {
            posts.map((item, idx) => 
                <Row key={idx}>
                  <Col>
                    <Alert variant="secondary">
                        {item.text}
                    </Alert>
                  </Col>
                </Row>
            )
          }
        </Container>
    );
}

export default PostForm