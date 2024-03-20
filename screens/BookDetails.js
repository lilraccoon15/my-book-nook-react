import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const BookDetails = ({ route, navigation }) => {
  const { book, userId } = route.params;
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [bookStatus, setBookStatus] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);

  const getBookInfo = (book) => {
    return book.volumeInfo ? book : book.details;
  };

  const bookInfo = getBookInfo(book);

  const fetchBookStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getBookStatus?userId=${userId}&bookId=${bookInfo.id}`);
      if (response && response.status === 200) {
          setBookStatus(response.data); 
      } else if (response && response.status === 404) {
          setBookStatus(null); 
      } else {
          setBookStatus(null);
      }
    } catch (error) {
        setBookStatus(null);
    }
  };

  useEffect(() => {
    fetchBookStatus();
  }, []);

  const fetchRelatedBooks = async () => {
    try {
      const author = bookInfo.volumeInfo.authors && bookInfo.volumeInfo.authors[0];
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=5`);
      setRelatedBooks(response.data.items);
    } catch (error) {
      console.error('Erreur lors de la récupération des livres associés : ', error);
    }
  };

  useEffect(() => {
    fetchRelatedBooks();
  }, []);

  const handleAddToCollection = async (status) => {
    try {
      const response = await axios.post('http://localhost:3000/addBookToCollection', {
          userId: userId,
          bookId: bookInfo.id,
          owned: status.owned === true ? true : null, 
          already_read: status.already_read === true ? true : null, 
          reading: status.reading === true ? true : null, 
          wishlist: status.wishlist === true ? true : null, 
          stars: null
      });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du livre à la collection : ', error);
    }
  };

  const handleModifyBook = async (updatedFields) => {
    try {
      const { userId, bookId, ...updateFields } = updatedFields;
      const response = await axios.put('http://localhost:3000/modifyBook', {
          userId: updatedFields.userId,
          bookId: updatedFields.bookId,
          updateFields: updateFields 
      });
    } catch (error) {
        throw error; 
    }
  };

  const handleOwned = async () => {
    try {
      if (bookStatus === null) {
        await fetchBookStatus();
      }
      if (bookStatus === null) {
        await handleAddToCollection({ owned: true });
        await fetchBookStatus();
      } else {
        if (bookStatus.status.owned === "1") {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, owned: false });
        } else {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, owned: true });
        }
          await fetchBookStatus();
      }
    } catch (error) {
        console.error('Erreur lors de la modification du statut du livre : ', error);
    }
  };

  const handleWantToRead = async () => {
    try {
      if (bookStatus === null) {
        await fetchBookStatus();
      }

      if (bookStatus === null) {
        await handleAddToCollection({ wishlist: true });
        await fetchBookStatus();
      } else {
        if (bookStatus.status.wishlist === "1") {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, wishlist: false });
        } else {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, wishlist: true });
        }
          await fetchBookStatus();
      }
    } catch (error) {
        console.error('Erreur lors de la modification du statut du livre : ', error);
    }
  };

  const handleCurrentlyReading = async () => {
    try {
      if (bookStatus === null) {
        await fetchBookStatus();
      }
      if (!bookStatus) {
        await handleAddToCollection({ reading: true });
        await fetchBookStatus();
      } else {
        if (bookStatus.status.reading === "1") {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, reading: false });
        } else {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, reading: true });
        }
          await fetchBookStatus();
      }
    } catch (error) {
        console.error('Erreur lors de la modification du statut du livre : ', error);
    }
  };

  const handleAlreadyRead = async () => {
    try {
      if (bookStatus === null) {
        await fetchBookStatus();
      }
        if (!bookStatus) {
          await handleAddToCollection({ already_read: true });
          await fetchBookStatus();
        } else {
          if (bookStatus.status.already_read === "1") {
            await handleModifyBook({ userId: userId, bookId: bookInfo.id, already_read: false });
          } else {
            await handleModifyBook({ userId: userId, bookId: bookInfo.id, already_read: true });
          }
            await fetchBookStatus();
        }
    } catch (error) {
        console.error('Erreur lors de la modification du statut du livre : ', error);
    }
  };

  const handleRating = async (value) => {
    setRating(value);
    try {
      if (bookStatus === null) {
        await fetchBookStatus();
      }
      if (!bookStatus) {
        await handleAddToCollection({ stars: value });
        await fetchBookStatus();
      } else {
        if (bookStatus.status.stars !== value.toString()) {
          await handleModifyBook({ userId: userId, bookId: bookInfo.id, stars: value });
          await fetchBookStatus();
        } else {
          console.log("La note est déjà à la valeur spécifiée.");
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la note : ', error);
    }
  };


  const handleStarPressIn = (index) => {
    setHoveredStar(index);
  };

  const handleStarPressOut = () => {
    setHoveredStar(0);
  };

  const handleStarHover = (index) => {
    setHoveredStar(index);
  };

  const handleRelatedBookPress = (selectedBook) => {
    navigation.push('BookDetails', { book: selectedBook, userId });
  };

  const getRank = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:3000/getRank?bookId=${bookId}`);
      if (response && response.status === 200) {
        const rank = response.data.rank;
      } else {
        console.error('Erreur lors de la récupération du rang du livre.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rang du livre : ', error);
    }
  };

  useEffect(() => {
    getRank(bookInfo.id);
  }, []);


  const ownedButtonColor = bookStatus && bookStatus.status.owned === "1" ? '#f4511e' : 'grey';
  const wantToReadButtonColor = bookStatus && bookStatus.status.wishlist === "1" ? '#f4511e' : 'grey';
  const currentlyReadingButtonColor = bookStatus && bookStatus.status.reading === "1" ? '#f4511e' : 'grey';
  const alreadyReadButtonColor = bookStatus && bookStatus.status.already_read === "1" ? '#f4511e' : 'grey';
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bookInfo.volumeInfo.title}</Text>
      {bookInfo.volumeInfo.imageLinks && bookInfo.volumeInfo.imageLinks.thumbnail ? (
        <Image
          source={{ uri: bookInfo.volumeInfo.imageLinks.thumbnail }}
          style={styles.thumbnail}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require('../assets/no_cover.jpg')} 
          style={styles.thumbnail}
          resizeMode="contain"
        />
      )}

      <Text style={styles.description}>{bookInfo.volumeInfo.description}</Text>
      <Text style={styles.authors}>Auteur(s): {bookInfo.volumeInfo.authors && bookInfo.volumeInfo.authors.join(', ')}</Text>
      <Text>{rank}</Text>
      <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleRating(index)}
          onPressIn={() => handleStarPressIn(index)}
          onPressOut={handleStarPressOut}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleStarPressOut}
        >
          <MaterialIcons
            name={(index <= (hoveredStar || rating)) ? 'star' : 'star'}
            size={30}
            color={(index <= (parseInt(bookStatus && bookStatus.status.stars) || rating)) ? '#f4511e' : 'gray'}
          />
        </TouchableOpacity>
      ))};
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, { backgroundColor: ownedButtonColor }]} onPress={handleOwned}>
          <Text style={styles.buttonText}>J'ai</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: wantToReadButtonColor }]} onPress={handleWantToRead}>
          <Text style={styles.buttonText}>Je veux</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentlyReadingButtonColor }]} onPress={handleCurrentlyReading}>
          <Text style={styles.buttonText}>Je lis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: alreadyReadButtonColor }]} onPress={handleAlreadyRead}>
          <Text style={styles.buttonText}>J'ai lu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.relatedTitle}>Livres de {bookInfo.volumeInfo.authors && bookInfo.volumeInfo.authors[0]}</Text>
      <FlatList
        data={relatedBooks}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRelatedBookPress(item)}>
            <View style={styles.relatedBookContainer}>
              {item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? (
                <Image
                  source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                  style={styles.relatedThumbnail}
                  resizeMode="contain"
                />
              ) :
              (
                <Image
                source={require('../assets/no_cover.jpg')}
                  style={styles.relatedThumbnail}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.relatedBookTitle}>{item.volumeInfo.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    thumbnail: {
      width: 150,
      height: 200,
      marginBottom: 10,
    },
    description: {
      marginBottom: 10,
    },
    authors: {
      fontStyle: 'italic',
      marginBottom: 10,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#f4511e',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    relatedTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    relatedBookContainer: {
      marginRight: 10,
    },
    relatedThumbnail: {
      width: 100,
      height: 150,
      marginBottom: 5,
    },
    relatedBookTitle: {
      fontSize: 14,
      textAlign: 'center',
    },
  });

export default BookDetails;
