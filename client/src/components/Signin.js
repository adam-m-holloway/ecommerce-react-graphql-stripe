import React, { useState } from 'react';
import { Container, Box, Button, Heading, TextField } from 'gestalt';
import { ToastMessage } from './ToastMessage';
import { setToken } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const Signin = props => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ event, value }) => {
    switch (event.target.name) {
      case 'username':
        setUserName(value);
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

    // sign in user
    const signinUser = async () => {
      try {
        // set loading to true
        setIsLoading(true);

        // make request to register user with strapi
        const response = await strapi.login(username, password);

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
        showToasts(err.message);
      }
    };

    signinUser();
  };

  const redirectUser = path => {
    props.history.push(path);
  };

  const isFormEmpty = () => !username || !password;

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
            <Heading color="midnight">Welcome back!</Heading>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
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
