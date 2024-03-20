import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Library = ({ navigation, route }) => {
  const { userId } = route.params;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooksUser();
  }, []);

  const fetchBooksUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getBooksUser?userId=${userId}`);
      if (response && response.status === 200) {
        setBooks(response.data);
      } else if (response && response.status === 404) {
        console.log("Le livre n'a pas été trouvé.");
        setBooks([]);
      } else {
        console.error("La requête a retourné un code d'état non géré:", response.status);
        setBooks([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des livres:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBooksUser();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToBookDetails = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const navigateToShelves = (shelf) => {
    navigation.navigate('Shelves', { shelf });
  };

  const readBooks = Array.isArray(books.status) ? books.status.filter(book => book.already_read === '1') : [];
  const ownedBooks = Array.isArray(books.status) ? books.status.filter(book => book.owned === '1') : [];
  const readingBooks = Array.isArray(books.status) ? books.status.filter(book => book.reading === '1') : [];
  const wishlistBooks = Array.isArray(books.status) ? books.status.filter(book => book.wishlist === '1') : [];

  return (
    <View>
      <Text>Librairie</Text>
      <Text>User ID: {userId}</Text>

      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => navigateToShelves('already_read')}>
          <Text style={styles.title}>Lus</Text>
        </TouchableOpacity>
        <View style={styles.booksContainer}>
          {readBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBookDetails(book)}>
                {book.details.volumeInfo.imageLinks && book.details.volumeInfo.imageLinks.thumbnail ? (
                  <Image
                    source={{ uri: book.details.volumeInfo.imageLinks.thumbnail }}
                    style={styles.bookCover}
                  />
                  ) : (
                    <Image
                      source={require('../assets/no_cover.jpg')} 
                      style={styles.bookCover}
                    />
                  )
                }
                
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => navigateToShelves('owned')}>
          <Text style={styles.title}>Possédés</Text>
        </TouchableOpacity>
        <View style={styles.booksContainer}>
          {ownedBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBookDetails(book)}>
                {book.details.volumeInfo.imageLinks && book.details.volumeInfo.imageLinks.thumbnail ? (
                  <Image
                    source={{ uri: book.details.volumeInfo.imageLinks.thumbnail }}
                    style={styles.bookCover}
                  />
                  ) : (
                    <Image
                      source={require('../assets/no_cover.jpg')} 
                      style={styles.bookCover}
                    />
                  )
                }
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => navigateToShelves('reading')}>
          <Text style={styles.title}>En cours de lecture</Text>
        </TouchableOpacity>
        <View style={styles.booksContainer}>
          {readingBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBookDetails(book)}>
                {book.details.volumeInfo.imageLinks && book.details.volumeInfo.imageLinks.thumbnail ? (
                  <Image
                    source={{ uri: book.details.volumeInfo.imageLinks.thumbnail }}
                    style={styles.bookCover}
                  />
                  ) : (
                    <Image
                      source={require('../assets/no_cover.jpg')} 
                      style={styles.bookCover}
                    />
                  )
                }
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => navigateToShelves('wishlist')}>
          <Text style={styles.title}>Liste de souhaits</Text>
        </TouchableOpacity>
        <View style={styles.booksContainer}>
          {wishlistBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBookDetails(book)}>
                {book.details.volumeInfo.imageLinks && book.details.volumeInfo.imageLinks.thumbnail ? (
                  <Image
                    source={{ uri: book.details.volumeInfo.imageLinks.thumbnail }}
                    style={styles.bookCover}
                  />
                  ) : (
                    <Image
                      source={require('../assets/no_cover.jpg')} 
                      style={styles.bookCover}
                    />
                  )
                }
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: 10,
  },
  booksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  bookItem: {
    alignItems: 'center',
    marginVertical: 10,
  },
  bookCover: {
    width: 100,
    height: 150,
  },
});

export default Library;
