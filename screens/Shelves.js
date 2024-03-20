import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const Shelves = ({ route, navigation }) => {
  
    const { shelf, userId } = route.params;
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooksUser();
    }, []);

    const fetchBooksUser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/getBooksShelves?userId=${userId}&shelf=${shelf}`);
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

    console.log(shelf);

  return (
    <View style={styles.categoryContainer}>
        <Text style={styles.title}>{shelf}</Text>
        <View style={styles.booksContainer}>
          {books.map(book => (
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
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    }
});

export default Shelves;
