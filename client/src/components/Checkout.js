import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Heading,
  TextField,
  Text,
  Modal,
  Spinner
} from 'gestalt';
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
  const [orderProcessing, setOrderProcessing] = useState(true);
  const [modal, setModal] = useState(false);

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

  const handleConfirmOrder = async event => {
    event.preventDefault();

    if (isFormEmpty()) {
      showToasts('Fill in all field'); // error message to show if form is empty
      return;
    }

    setModal(true);
  };

  const handleSubmitOrder = () => {};

  const closeModal = () => setModal(false);

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
        {console.log('cart items length:', cartItems.length)}
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
                  type="text"
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
                <Button text="Submit" color="blue" type="submit" />
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

      {/* Confirmation Modal */}
      {modal && (
        <ConfirmationModal
          orderProcessing={orderProcessing}
          cartItems={cartItems}
          closeModal={closeModal}
          handleSubmitOrder={handleSubmitOrder}
        />
      )}

      <ToastMessage show={showToast} message={toastMessage} />
    </Container>
  );
};

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm Your Order"
    heading="Confirm Your Order"
    role="alertdialog"
    size="sm"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          ></Button>
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          ></Button>
        </Box>
      </Box>
    }
  >
    {/* Order summary */}
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
              {item.name} x {item.quantity} = ${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text size="lg" bold>
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}

    {/* Order processing spinnner */}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order Processing Spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting order...
      </Text>
    )}
  </Modal>
);
