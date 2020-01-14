import React, { useState } from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';
import { ToastMessage } from './ToastMessage';
import { setToken } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const Signup = props => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ event, value }) => {
    switch (event.target.name) {
      case 'username':
        setUserName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (isFormEmpty()) {
      showToasts('Fill in all field'); // error message to show if form is empty
    }

    // sign up user
    const signUpUser = async () => {
      try {
        // set loading to true
        setIsLoading(true);

        // make request to register user with strapi
        const response = await strapi.register(username, email, password);

        // set loading to false
        setIsLoading(false);

        // put token (to manage user session) in local storage
        setToken(response.jwt);

        // redirect user to home page
        redirectUser('/');
      } catch (err) {
        // set loading to false
        setIsLoading(false);

        // show error message
        console.log('error msg:', err.message);
        showToasts(err.message);
      }
    };

    signUpUser();
  };

  const redirectUser = path => {
    props.history.push(path);
  };

  const isFormEmpty = () => !username || !email || !password;

  // show error messages
  const showToasts = toastMessage => {
    setShowToast(true);
    setToastMessage(toastMessage);

    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 5000);
  };

  return (
    <Container>
      <Box
        margin={4}
        padding={4}
        shape="rounded"
        display="flex"
        justifyContent="center"
      >
        <form
          style={{
            display: 'inlineBlock',
            textAlign: 'center',
            maxWidth: 450
          }}
          onSubmit={handleSubmit}
        >
          <Box
            marginBottom={2}
            display="flex"
            direction="column"
            alignItems="center"
          >
            <Heading color="midnight">Let's Get Started</Heading>
            <Text italic color="orchid">
              Sign up to order some brews!
            </Text>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <Button
              text="Submit"
              color="blue"
              type="submit"
              disabled={isLoading}
            />
          </Box>
        </form>
      </Box>
      <ToastMessage show={showToast} message={toastMessage} />
    </Container>
  );
};
