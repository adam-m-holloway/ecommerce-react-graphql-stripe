import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Heading, TextField, Text } from 'gestalt';
import { ToastMessage } from './ToastMessage';
import { getCart, calculatePrice } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [confirmationEmailAddress, setConfirmationEmailAddress] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ event, value }) => {
    switch (event.target.name) {
      case 'address':
        setAddress(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'confirmationEmailAddress':
        setConfirmationEmailAddress(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleConfirmOrder = event => {
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
        // const response = await strapi.register(username, email, password);

        // set loading to false
        setIsLoading(false);

        // put token (to manage user session) in local storage
        //setToken(response.jwt);

        // redirect user to home page
        //redirectUser('/');
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

  const isFormEmpty = () =>
    !address || !postalCode || !city || !confirmationEmailAddress;

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
        <Heading color="midnight">Checkout</Heading>
        {cartItems.length > 0 ? (
          <>
            {/* User cart */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              direction="column"
              marginTop={2}
              marginBottom={2}
            >
              <Text color="darkGray" italic>
                {cartItems.length} Items for Checkout
              </Text>
              <Box padding={2}>
                {cartItems.map(item => (
                  <Box key={item._id} padding={1}>
                    <Text color="midnight">
                      {item.name} x {item.quantity} - $
                      {item.quantity * item.price}
                    </Text>
                  </Box>
                ))}
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>
            </Box>
            {/* Checkout form */}
            <form
              style={{
                display: 'inlineBlock',
                textAlign: 'center',
                maxWidth: 450
              }}
              onSubmit={handleConfirmOrder}
            >
              <Box
                marginBottom={2}
                display="flex"
                direction="column"
                alignItems="center"
              >
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Shipping Address"
                  onChange={handleChange}
                />
                <TextField
                  id="postalCode"
                  type="number"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                />
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City of Residence"
                  onChange={handleChange}
                />
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
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
          </>
        ) : (
          // default text if no item in cart
          <Box color="darkWash" shape="rounded" padding={4}>
            <Heading>Your cart is empty</Heading>
            <Text>Add some brews!</Text>
          </Box>
        )}
      </Box>
      <ToastMessage show={showToast} message={toastMessage} />
    </Container>
  );
};
