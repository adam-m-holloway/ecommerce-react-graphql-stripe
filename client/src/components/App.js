import React, { useEffect, useState } from 'react';
import { Container, Box, Heading } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const App = () => {
  const [brands, setBrands] = useState({ brands: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await strapi.request('POST', '/graphql', {
          data: {
            query: `query {
                brands {
                  _id
                  name
                  description
                  image {
                    url
                  }
                }
              }`
          }
        });

        setBrands({ brands: response.data.brands });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
      </Box>
    </Container>
  );
};
