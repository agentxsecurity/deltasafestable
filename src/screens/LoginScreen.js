import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !nationalId) {
      Alert.alert('Error', 'Please enter both phone number and national ID');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Dashboard');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Delta-Safe</Title>
          <Text style={styles.subtitle}>Emergency Reporting System</Text>
          <TextInput label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} mode="outlined" />
          <TextInput label="National ID" value={nationalId} onChangeText={setNationalId} secureTextEntry style={styles.input} mode="outlined" />
          <Button mode="contained" onPress={handleLogin} loading={isLoading} disabled={isLoading} style={styles.button}>Login / Register</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { margin: 16, marginTop: 50 },
  title: { textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#2E86AB', marginBottom: 8 },
  subtitle: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 30 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
});
