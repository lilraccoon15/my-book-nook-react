import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (query.length >= 4) {
      const delayTimer = setTimeout(() => {
        searchBooks();
      }, 250);

      return () => clearTimeout(delayTimer);
    } else {
      setBooks([]);
    }
  }, [query]);

  const searchBooks = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      if (response.data.items) {
        setBooks(response.data.items);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const navigateToBookDetails = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBookDetails(item)}>
      <View style={styles.bookContainer}>
        <Image
          source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }}
          style={styles.bookImage}
        />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
          <Text style={styles.bookAuthors}>Authors: {item.volumeInfo.authors?.join(', ') || 'Unknown'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search books..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  bookContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 8,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthors: {
    fontSize: 14,
  },
});

export default Search;
