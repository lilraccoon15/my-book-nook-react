import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const HomePage = ({ navigation }) => {
  const [bestRankedBooks, setBestRankedBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBestRankedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getBestRanked');
        setBestRankedBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres les mieux notés : ', error);
        setLoading(false);
      }
    };

    fetchBestRankedBooks();
  }, []);

  const renderBookItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate('BookDetails', { book : item })} style={styles.bookItem}>
      <Image source={{ uri: item.details.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.details.title}</Text>
        <Text>Rating: {item.average_rating}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text>Bienvenue sur la page d'accueil !</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={bestRankedBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.book_id.toString()}
          style={styles.bookList}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookList: {
    width: '100%',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default HomePage;
