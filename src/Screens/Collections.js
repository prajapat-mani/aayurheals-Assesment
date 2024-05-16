import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Pressable } from 'react-native';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

const client = new ApolloClient({
  uri: 'https://mock.shop/api',
  cache: new InMemoryCache(),
});

const GET_COLLECTIONS = gql`
  {
    collections(first: 2) {
      edges {
        cursor
        node {
          id
          handle
          title
          description
          image {
            id
            url
          }
        }
      }
    }
  }
`;

const CollectionsComponent = () => {
  const navigation = useNavigation()
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: GET_COLLECTIONS,
        });
        setCollections(data.collections.edges);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function gotoproduct(key) {
    navigation.navigate("Product",{state:key})
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {collections.map(collection => (
        <Pressable key={collection.node.id} onPress={() => gotoproduct(collection.node.title)}>
          <View style={styles.collection}>
            <Text style={styles.titleOnImage}>{collection.node.title}</Text>
            <Image source={{ uri: collection?.node?.image?.url }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.description}>{collection.node.description}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default function Collections() {
  return (
    <ApolloProvider client={client}>
      <CollectionsComponent />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  collection: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
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
  },
  titleOnImage: {
    position: 'absolute',
    
    fontSize: 25,
    fontWeight:"900",
    color: 'black',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});
