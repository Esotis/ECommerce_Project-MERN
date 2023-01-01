import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useSignupMutation } from "../services/appApi";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signup, { error, isLoading, isError }] = useSignupMutation();

  function handleSignup(e) {
    e.preventDefault();
    signup({ name, email, password });
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={6} className="signup__form--container">
            <Form style={{ width: "100%" }} onSubmit={handleSignup}>
              <h1>Create an account</h1>
              {isError && <Alert variant="danger">{error.data}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Button type="submit" disabled={isLoading}>
                  Create Account
                </Button>
              </Form.Group>

              <p className="pt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>{" "}
              </p>
            </Form>
          </Col>
          <Col md={6} className="signup__image--container"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
