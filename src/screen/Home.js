import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  getCameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'; // For API calls
import * as Location from 'expo-location';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, check, RESULTS} from 'react-native-permissions';

const RAPID_API_KEY =
  // '474719f573mshd44dbfa652e964bp11f4a0jsn08b6d5c36835' // RAKESH Sir Rapid
  // 'e228ce412amshe1d1e4ed7e53ca2p186c23jsnc6a42635a7d3' // DILEEP Rapid
  // 'a38e6339b7mshc53d3fdf983670fp18e28cjsnf6125d659cec' // SAHIL RApid
  // 'e189460b28mshca97ffbe9db46d7p19e04ejsn5f8824985efd' // SRISHTI Rapid
  '170726995cmshaac37814ce3569ap15d2e1jsn7faa0f612f29'; // Rakes2 Rapid
// 'c8c2566abemsh588afab9d714b38p1d3484jsn58cc15bb6517' // Rakes2 Rapid
const RAPID_API_HOST = 'google-map-places.p.rapidapi.com';
const GOOGLE_MAPS_URL = `https://${RAPID_API_HOST}/maps/api/geocode/json`;

const Home = () => {
  const camera = useRef(null);
  const ref = useRef();
  const devices = Camera.getAvailableCameraDevices();
  const [currentCamera, setCurrentCamera] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const [address, setAddress] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const device = getCameraDevice(devices, currentCamera);

  useEffect(() => {
    requestPermissions();

  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    const permissionStatus = Camera.getLocationPermissionStatus();
    const newPermissionStatus = await Camera.requestLocationPermission();

    let locationPermission = false;
console.log('permissionStatus',permissionStatus)
    if (Platform.OS === 'android') {
      locationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } else {
      locationPermission = await Camera.requestLocationPermission();
    }

    if (
      cameraPermission === 'granted' &&
      microphonePermission === 'granted' &&
      locationPermission === 'granted'
    ) {
      setHasPermission(true);
    } else {
      Alert.alert(
        'Permissions Required',
        'Camera, microphone, and location permissions are required.',
      );
    }
  };
  useEffect(() => {
    const fetchLocation = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Permission Denied',
          'Location access is required to proceed.',
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        fetchAddress(location?.coords?.latitude, location?.coords?.longitude);
        setLocation({
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Failed to fetch location');
      }
    };

    fetchLocation();
  }, []);
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const isPM = hours >= 12;
    hours = hours % 12 || 12;

    const formattedDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    } ${isPM ? 'PM' : 'AM'}`;

    const gmtOffset = now.toTimeString().split(' ')[1]; // Extract 'GMT'

    return `${formattedDate} ${formattedTime} ${gmtOffset}`;
  };

  const currentDateTime = getCurrentDateTime();

  const fetchAddress = async (latitude, longitude) => {
    const options = {
      method: 'GET',
      url: GOOGLE_MAPS_URL,
      params: {
        latlng: latitude + ' ' + longitude,
      },
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
      },
    };

    try {
      const response = await axios.request(options);

      setAddress(response?.data?.results[0]?.formatted_address);
    } catch (error) {
      console.log('error', error);
    }
    // try {
    //   const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key

    //   const address =
    //     response.data.results[0]?.formatted_address || 'Address not found';
    //   setAddress(address);
    //   return address;
    // } catch (error) {
    //   console.error('Error fetching address:', error);
    //   return 'Unable to fetch address';
    // }
  };

  const toggleCamera = () => {
    setCurrentCamera(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };
  const getAddressData = () => {
    const regex = /(?:, )([^,]+, [^,]+ \d{6}, [^,]+)$/;
    const match = address?.match(regex);

    if (match && match[1]) {
      return match[1].trim(); // Return the extracted part
    } else {
      return 'Unable to extract city, state, and postal code.';
    }
  };

  const handleCapture = async () => {
    try {
      const uri = await ref.current.capture();
      console.log('Captured Image Path:', uri);

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to save the image.',
        );
        return;
      }

      // Save the screenshot to the gallery
      const galleryPath = `${
        RNFS.PicturesDirectoryPath
      }/screenshot_${Date.now()}.jpg`;
      await RNFS.moveFile(uri, galleryPath);

      Alert.alert('Screenshot Captured!', `Saved to Gallery: ${galleryPath}`);
      setCapturedPhoto(null);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      Alert.alert('Error', 'Failed to save screenshot to gallery.');
    }
  };
  const takePhoto = async () => {
    try {
      if (camera.current == null) {
        console.error('Camera ref is null');
        return;
      }

      const photo = await camera.current.takePhoto({
        flash: 'off', // You can use 'on', 'off', 'auto' or 'torch'
        qualityPrioritization: 'quality', // 'quality' or 'speed'
        enableAutoStabilization: true, // Improves photo quality
      });

      setCapturedPhoto(`file://${photo.path}`);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take a photo.');
    }

    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      //   setErrorMsg('Permission to access location was denied');
      return;
    }
  };
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'App needs access to your storage to save images to the gallery.',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      if (status === RESULTS.GRANTED) {
        return true;
      } else {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
        return result === RESULTS.GRANTED;
      }
    }
    return false;
  };
  const normalizePath = filePath => {
    if (filePath.startsWith('file://')) {
      return filePath.replace('file://', '');
    }
    return filePath;
  };
  const deletePhoto = async filePath => {
    try {
      if (!filePath) {
        throw new Error('File path is not provided!');
      }

      const normalizedPath = normalizePath(filePath);

      const fileExists = await RNFS.exists(normalizedPath);
      if (fileExists) {
        await RNFS.unlink(normalizedPath);
        Alert.alert('Success', 'Photo deleted successfully!');
        setCapturedPhoto(null);
      } else {
        Alert.alert('Error', 'File does not exist!');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.85}}>
        {device  ? (
          <>
            {capturedPhoto ? (
              <ViewShot
                ref={ref}
                style={{flex: 1}}
                options={{
                  fileName: 'Your-File-Name',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <Image
                  source={{uri: capturedPhoto}}
                  resizeMode="cover"
                  style={{flex: 1}}
                />

                <View style={styles.locationInfo}>
                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '25%', height: 100}}>
                      <Image
                        source={require('../assets/google.webp')}
                        style={{width: '100%', height: '100%'}}
                      />
                    </View>
                    <View
                      style={{
                        width: '70%',
                        height: 100,

                        marginLeft: 10,
                      }}>
                      <Text>{getAddressData()}</Text>
                      <Text>{address}</Text>
                      <Text>
                        Lat {location?.latitude} lon{location?.longitude}
                      </Text>
                      <Text>{currentDateTime}</Text>
                    </View>
                  </View>
                </View>
              </ViewShot>
            ) : (
              <>
                <Camera
                  ref={camera}
                  style={{flex: 1}}
                  device={device}
                  isActive={true}
                  // video={true}
                  // audio={true}
                  photo={true}
                  onInitialized={onCameraReady}
                  enableLocation={true}
                />

                <View style={styles.locationInfo}>
                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '25%', height: 100}}>
                      <Image
                        source={require('../assets/google.webp')}
                        style={{width: '100%', height: '100%'}}
                      />
                    </View>
                    <View
                      style={{
                        width: '70%',
                        height: 100,

                        marginLeft: 10,
                      }}>
                      <Text>{getAddressData()}</Text>
                      <Text>{address}</Text>
                      <Text>
                        Lat {location?.latitude} lon{location?.longitude}
                      </Text>
                      <Text>{currentDateTime}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        ) : (
          <Text style={{textAlign: 'center', marginTop: 50}}>
            Waiting for permissions...
          </Text>
        )}
      </View>
      <View style={{flex: 0.15}}>
        {capturedPhoto ? (
          <View style={styles.controls}>
            <Button
              title="Delete Photo"
              onPress={() => deletePhoto(capturedPhoto)}
            />
            <Button title="Done" onPress={() => handleCapture()} />
          </View>
        ) : (
          <View style={styles.controls}>
            <Button title="Take Photo" onPress={takePhoto} />
            <Button title="Change Camera" onPress={toggleCamera} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 10,
    width: '100%',

    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
  },
});
