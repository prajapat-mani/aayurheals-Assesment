import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery } from '@apollo/client';
import { ToastProvider, useToast } from 'react-native-toast-notifications';

const Product = ({ route }) => {
  const client = new ApolloClient({
    uri: 'https://mock.shop/api',
    cache: new InMemoryCache(),
  });

  const GET_PRODUCTS = gql`
    {
      products(first: ${route.params.state == 'Men' ? 2 : 7}) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              id
              url
            }
            variants(first: 3) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const ProductList = () => {
    const toast = useToast();
    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
      refetch();
    }, [route.params.state]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const productsToShow = route.params.state == 'Men' ? data.products.edges : data.products.edges.slice(5);

    const handleVariantClick = (variantId) => {
      setSelectedVariant(variantId);
    };

    const handleAddToCart = (productName) => {
      const selectedVariantTitle = data.products.edges
        .flatMap(({ node }) => node.variants.edges.map(({ node: variant }) => variant))
        .find((variant) => variant.id === selectedVariant)?.title;

      if (selectedVariantTitle) {
        toast.show(`Successfully added: ${productName} - ${selectedVariantTitle} to cart.`, {
          type: 'success',
          placement: 'top',
        });
      } else {
        toast.show(`Successfully added: ${productName} to cart.`, {
          type: 'success',
          placement: 'top',
        });
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {productsToShow.map(({ node }) => (
          <View key={node.id} style={styles.product}>
            <Image source={{ uri: node.featuredImage.url }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.title}>{node.title}</Text>
              <Text style={styles.description}>{node.description}</Text>

              <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                {node.variants.edges.map(({ node: variant }) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variationButton,
                      selectedVariant === variant.id && { backgroundColor: 'lightgray' },
                    ]}
                    onPress={() => handleVariantClick(variant.id)}
                  >
                    <Text style={[styles.variationText, selectedVariant === variant.id && { color: 'black' }]}>
                      {variant.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.price}>Price: {node?.variants?.edges[0]?.node?.price?.amount}</Text>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.addtocart, !selectedVariant && { backgroundColor: 'gray' }]}
                    onPress={() => handleAddToCart(node.title)}
                    disabled={!selectedVariant}
                  >
                    <Text style={{ color: 'white' }}>Add To Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ApolloProvider client={client}>
      <ToastProvider>
        <ProductList />
      </ToastProvider>
    </ApolloProvider>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  product: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 400,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: 'black',
    marginLeft: 10,
    marginBottom:10,
    fontWeight:"900",
  },
  variationButton: {
    // backgroundColor: 'off-white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    // alignItems: 'center',
  },
  variationText: {
    color: 'red',
  },
  addtocart: {
    opacity: 1,
    borderWidth: 2,
    padding: 10,
    backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
  },
});
