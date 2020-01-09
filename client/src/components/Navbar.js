import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

export const Navbar = () => (
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
