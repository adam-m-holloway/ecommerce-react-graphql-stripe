import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Card,
  Button,
  Mask,
  IconButton
} from 'gestalt';
import { Link } from 'react-router-dom';
import { calculatePrice, getCart, setCart } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const Brews = props => {
  const [brews, setBrews] = useState([]);
  const [brand, setBrand] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await strapi.request('POST', '/graphql', {
          data: {
            query: `query {
            brand(id: "${props.match.params.brandId}") {
              _id
              name
              brews {
                _id
                name
                description
                image {
                  url
                }
                price
              }
            }
          }`
          }
        });

        setBrews(response.data.brand.brews);
        setBrand(response.data.brand.name);
        setCartItems(getCart()); // get cart from localStorage
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [props.match.params.brandId]);

  // TODO: can this be improved?
  useEffect(() => {
    if (cartItems.length > 0) {
      setCart(cartItems); // set items to localStorage
    }
  }, [cartItems]);

  const addToCart = brew => {
    const alreadyInCart = cartItems.findIndex(item => item._id === brew._id);

    // if no brew with the ID in our index
    if (alreadyInCart === -1) {
      const updatedItems = cartItems.concat({
        ...brew,
        quantity: 1
      });
      setCartItems(updatedItems);
    } else {
      const updatedItems = [...cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      setCartItems(updatedItems);
    }
  };

  const deleteItemFromCart = itemToDeleteId => {
    const filteredItems = cartItems.filter(item => item._id !== itemToDeleteId);
    setCartItems(filteredItems);
  };

  return (
    <Box
      marginTop={4}
      display="flex"
      justifyContent="center"
      alignItems="start"
    >
      <Box display="flex" direction="column" alignItems="center">
        <Box margin={2}>
          <Heading color="orchid">{brand}</Heading>
        </Box>
        <Box display="flex" justifyContent="center" padding={4}>
          {brews.map(brew => (
            <Box width={200} margin={2} key={brew._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brew.image[0].url}`}
                    />
                  </Box>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Box marginBottom={2}>
                    <Text bold size="xl">
                      {brew.name}
                    </Text>
                  </Box>
                  <Text>{brew.description}</Text>
                  <Text>${brew.price}</Text>

                  <Box marginTop={2}>
                    <Text bold size="xl">
                      <Button
                        onClick={() => addToCart(brew)}
                        color="blue"
                        text="Add to cart"
                      />
                    </Text>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* user cart */}
      <Box marginTop={2} marginLeft={8}>
        <Mask shape="rounded" wash>
          <Box
            display="flex"
            direction="column"
            alignItems="center"
            padding={2}
          >
            <Heading align="center" size="md">
              Your Cart
            </Heading>
            <Text color="gray" italic>
              {cartItems.length} items selected
            </Text>

            {cartItems.map(item => (
              <Box key={item._id} display="flex" alignItems="center">
                <Text>
                  {item.name} x {item.quantity} - $
                  {(item.quantity * item.price).toFixed(2)}
                </Text>
                <IconButton
                  accessibilityLabel="Delete Item"
                  icon="cancel"
                  size="sm"
                  iconColor="red"
                  onClick={() => deleteItemFromCart(item._id)}
                />
              </Box>
            ))}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <Box margin={2}>
                {cartItems.length === 0 && (
                  <Text color="red">Please select some items</Text>
                )}
              </Box>
              <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
              <Text>
                <Link to="/checkout">Checkout</Link>
              </Text>
            </Box>
          </Box>
        </Mask>
      </Box>
    </Box>
  );
};
