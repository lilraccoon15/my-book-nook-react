// register.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async () => {
    try {
        if (!username || !email || !password || !birthYear || !gender || !country || !acceptedTerms) {
            Alert.alert('Veuillez remplir tous les champs et accepter les termes et conditions');
            return;
            }

      const existingUser = await axios.post('http://localhost:3000/getUserByEmail', {
        email: email,
      });
  
      if (existingUser.data.length > 0) {
        Alert.alert('Cet e-mail est déjà utilisé. Veuillez en choisir un autre.');
        return;
      }

      const response = await axios.post('http://localhost:3000/register', {
        username: username,
        email: email,
        password: password,
        birth_year: birthYear,
        gender: gender,
        country: country,
        accepted_terms: acceptedTerms ? 1 : 0
      });

      if (response.data.success) {
        Alert.alert('Inscription réussie !');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur lors de l\'inscription');
      }
    } catch (error) {
      Alert.alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      console.error('Erreur lors de l\'inscription : ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Année de naissance"
        onChangeText={setBirthYear}
        value={birthYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        onChangeText={setGender}
        value={gender}
      />
      <TextInput
        style={styles.input}
        placeholder="Pays"
        onChangeText={setCountry}
        value={country}
      />
      <View style={styles.checkboxContainer}>
        <Button title={acceptedTerms ? "Accepté" : "Accepter les termes et conditions"} onPress={() => setAcceptedTerms(!acceptedTerms)} />
      </View>
      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default Register;
