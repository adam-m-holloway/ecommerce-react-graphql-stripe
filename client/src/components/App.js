import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Spinner
} from 'gestalt';
import { Link } from 'react-router-dom';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);

export const App = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBrands, setLoadingBrands] = useState(true);

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

        setBrands(response.data.brands);
        //setLoadingBrands(false);
      } catch (err) {
        console.error(err);
        setLoadingBrands(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = ({ value }) => {
    setSearchTerm(value);
  };

  const filteredBrands = !searchTerm
    ? brands
    : brands.filter(
        brand =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Container>
      <Box display="flex" justifyContent="center" margin-top={4}>
        <SearchField
          id="searchField"
          onChange={handleChange}
          placeholder="Search Brands"
          accessibilityLabel="search"
          value={searchTerm}
        />
      </Box>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
      </Box>
      {!loadingBrands ? (
        <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" />
      ) : (
        <Box display="flex" justifyContent="around">
          {filteredBrands.map(brand => (
            <Box width={200} margin={2} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image[0].url}`}
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
                  <Text bold size="xl">
                    {brand.name}
                  </Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};
