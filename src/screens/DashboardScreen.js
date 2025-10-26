import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';

const EMERGENCY_TYPES = [
  "Armed Robbery", "Kidnapping", "Fire Outbreak", "Motor Accident", 
  "Medical Emergency", "Flooding", "Crude Oil Theft", "Riots", 
  "Communal Crisis", "Protest", "Murder Cases", 
  "Law-enforcement Agents Brutality", "Others"
];

// HTML button component for web compatibility
const WebButton = ({ onPress, title, backgroundColor = '#FF3B30', color = 'white', disabled = false }) => {
  return (
    <button 
      style={{
        backgroundColor: disabled ? '#cccccc' : backgroundColor,
        color: color,
        padding: '16px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = backgroundColor === '#FF3B30' ? '#e0352b' : '#0056cc')}
      onMouseOut={(e) => !disabled && (e.target.style.backgroundColor = backgroundColor)}
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

// Backend API URL - change this to your deployed backend URL later
const API_URL = 'http://localhost:5000/api';

export default function DashboardScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingAlert, setSendingAlert] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState('unknown');

  useEffect(() => {
    getLocation();
    checkBackendStatus();
  }, []);

  const getLocation = async () => {
    try {
      console.log('📍 Getting location...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLastUpdate(new Date());
      console.log('📍 Location obtained');
    } catch (error) {
      setErrorMsg('Error getting location: ' + error.message);
      console.error('📍 Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setBackendStatus('connected');
      console.log('✅ Backend status:', data);
    } catch (error) {
      setBackendStatus('disconnected');
      console.log('❌ Backend not connected:', error.message);
    }
  };

  // Send emergency alert to backend
const sendEmergencyToBackend = async (emergencyType) => {
  setSendingAlert(true);
  
  try {
    const emergencyData = {
      type: emergencyType,
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      } : null,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending emergency to backend:', emergencyData);
    console.log('📤 API URL:', `${API_URL}/emergency`);

    const response = await fetch(`${API_URL}/emergency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emergencyData)
    });

    console.log('📤 Response status:', response.status);
    console.log('📤 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('📤 Error response:', errorText);
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Alert sent successfully:', result);
    
    alert(`✅ EMERGENCY ALERT SENT!\n\nHelp is on the way for: ${emergencyType}\n\nAlert ID: ${result.alertId}\n\nYour location has been shared with emergency services.`);
    
  } catch (error) {
    console.error('❌ Error sending alert:', error);
    alert(`⚠️ Alert submitted locally, but could not reach server.\n\nEmergency: ${emergencyType}\n\nError: ${error.message}\n\nPlease also call emergency services directly.`);
  } finally {
    setSendingAlert(false);
  }
};

  // Using browser confirm() for emergency alerts
  const handleEmergencyPress = (emergencyType) => {
    console.log('🚨 EMERGENCY BUTTON CLICKED:', emergencyType);
    
    let locationInfo = 'Location not available';
    if (location) {
      locationInfo = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
    }

    const userConfirmed = confirm(
      `🚨 ${emergencyType}\n\nAre you sure you want to report this emergency?\n\nYour location:\n${locationInfo}\n\nClick OK to send alert, or Cancel to go back.`
    );

    if (userConfirmed) {
      console.log('Alert confirmed, sending:', emergencyType);
      sendEmergencyToBackend(emergencyType);
    } else {
      console.log('Alert cancelled by user');
    }
  };

  const handleRefreshLocation = () => {
    console.log('🔄 Refresh button clicked');
    setLoading(true);
    setErrorMsg(null);
    getLocation();
  };

  const handleTestBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      alert(`✅ Backend Connection Successful!\n\n${data.message}\n\nServer is running properly.`);
      setBackendStatus('connected');
    } catch (error) {
      alert(`❌ Backend Connection Failed\n\nMake sure the backend server is running on port 5000.\n\nError: ${error.message}`);
      setBackendStatus('disconnected');
    }
  };

  const handleTestEmergency = () => {
    handleEmergencyPress("Test Emergency");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚨 Emergency Alert System</Text>
        <Text style={styles.subtitle}>Report emergencies with your location</Text>
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Current Location</Text>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <View>
            <Text style={styles.locationText}>
              Latitude: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.accuracyText}>
              Accuracy: ±{location.coords.accuracy} meters
            </Text>
            <Text style={styles.updateTime}>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
          </View>
        ) : (
          <Text style={styles.errorText}>No location data available</Text>
        )}
        
        {/* Refresh Button */}
        <WebButton 
          onPress={handleRefreshLocation}
          title="🔄 Refresh Location"
          backgroundColor="#007AFF"
        />
      </View>

      {/* Emergency Types */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 Emergency Types</Text>
        <Text style={styles.instruction}>
          Click any emergency type below to send an immediate alert with your current location
        </Text>
        
        {sendingAlert && (
          <View style={styles.sendingAlert}>
            <ActivityIndicator size="small" color="#FF3B30" />
            <Text style={styles.sendingText}>Sending emergency alert...</Text>
          </View>
        )}
        
        {EMERGENCY_TYPES.map((type, index) => (
          <WebButton 
            key={index}
            onPress={() => handleEmergencyPress(type)}
            title={type}
            backgroundColor="#FF3B30"
            disabled={sendingAlert}
          />
        ))}
      </View>

      {/* Backend Test Section - THIS IS THE NEW SECTION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 Backend Connection</Text>
        <Text style={styles.instruction}>
          Test if your backend server is running properly
        </Text>
        
        <View style={styles.backendStatus}>
          <Text style={[
            styles.statusText, 
            backendStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected
          ]}>
            Backend Status: {backendStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
          </Text>
        </View>
        
        <WebButton 
          onPress={handleTestBackend}
          title="✅ Test Backend Connection"
          backgroundColor="#28a745"
        />

        <WebButton 
          onPress={handleTestEmergency}
          title="🚨 Test Emergency Alert with Backend"
          backgroundColor="#FF9500"
        />

        <WebButton 
          onPress={checkBackendStatus}
          title="🔄 Check Backend Status"
          backgroundColor="#6c757d"
        />
      </View>

      {/* Status Panel */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>System Status</Text>
        <Text style={styles.statusItem}>📍 Location: {location ? '✅ Active' : '❌ Inactive'}</Text>
        <Text style={styles.statusItem}>🚨 Alerts: {sendingAlert ? '🔄 Sending...' : '✅ Ready'}</Text>
        <Text style={styles.statusItem}>🔧 Backend: {backendStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}</Text>
        <Text style={styles.statusItem}>📱 Buttons: ✅ HTML Buttons Working</Text>
        <Text style={styles.statusItem}>🌐 Platform: Web Browser</Text>
        <Text style={styles.statusItem}>Last checked: {new Date().toLocaleTimeString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  accuracyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  sendingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  sendingText: {
    marginLeft: 10,
    color: '#856404',
    fontWeight: '500',
  },
  backendStatus: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusConnected: {
    color: '#28a745',
  },
  statusDisconnected: {
    color: '#dc3545',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  statusItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
});
