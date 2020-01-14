import React from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink, withRouter } from 'react-router-dom';
import { getToken, clearToken, clearCart } from '../utils';

// withRouter gives access to `history` in this instance (not always needed)
export const Navbar = withRouter(props => {
  const handleSignout = () => {
    clearToken();
    clearCart();
    props.history.push('/');
  };

  return getToken() !== null ? (
    <AuthNav handleSignout={handleSignout} />
  ) : (
    <UnAuthNav />
  );
});

const AuthNav = ({ handleSignout }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={78}
    color="midnight"
    padding={1}
    shape={'roundedBottom'}
  >
    <NavLink to="/checkout">
      <Text size="xl" color="white">
        Checkout
      </Text>
    </NavLink>

    <NavLink to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} heigh={50} width={50}>
          <Image
            alt="BrewHaha Logo"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
          />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>
      </Box>
    </NavLink>

    <Button
      color="transparent"
      text="Sign out"
      inline
      size="md"
      onClick={handleSignout}
    />
  </Box>
);

const UnAuthNav = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={78}
    color="midnight"
    padding={1}
    shape={'roundedBottom'}
  >
    <NavLink to="/signin">
      <Text size="xl" color="white">
        Sign in
      </Text>
    </NavLink>

    <NavLink to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} heigh={50} width={50}>
          <Image
            alt="BrewHaha Logo"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
          />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>
      </Box>
    </NavLink>

    <NavLink to="/signup">
      <Text size="xl" color="white">
        Sign up
      </Text>
    </NavLink>
  </Box>
);
