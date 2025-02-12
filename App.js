// import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// import axios from 'axios';
// const customMapStyle = [
//   {
//     featureType: 'administrative.land_parcel',
//     elementType: 'labels',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'labels.text',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.business',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels.icon',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'road.local',
//     elementType: 'labels',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'transit',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
// ];
// const App = () => {
//   const mapRef = useRef(null);
//   const [cameraData, setCameraData] = useState([]);
//   useEffect(() => {
//     getCameraLocation();
//   }, []);
//   const getCameraLocation = async () => {
//     const url = 'https://www.data.act.gov.au/resource/426s-vdu4.json';
//     try {
//       const response = await axios.get(url);
     
//       setCameraData(response?.data);
//       // Process the data as needed
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     }
//   };
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View
//         style={{
//           flex: 1,
         
//         }}>
//         {/* <MapView

//           ref={mapRef}
//           // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//           style={StyleSheet.absoluteFillObject}
//           pitchEnabled={false}
//           key={'AIzaSyB7VGZufQFoCNq1Qt9UAuJxYW3Jl-H4xpw'}
//           // onRegionChangeComplete={handleRegionChangeComplete}
//           // initialRegion={indiaIntialRegion}
//           customMapStyle={customMapStyle}
//           initialRegion={{
//             latitude: 28.6139,
//             longitude: 77.2088,
//             latitudeDelta: 0.015,
//             longitudeDelta: 0.0121,
//           }}>
//           <Marker
//             coordinate={{
//               latitude: 28.5057,
//               longitude: 77.0967,
//             }}
//             title="You are here!"
//             description="Current location"
//           />
//         </MapView> */}
//         <MapView
//           style={StyleSheet.absoluteFillObject}
//           initialRegion={{
//             latitude: -35.2809, // Default to Canberra's latitude
//             longitude: 149.13, // Default to Canberra's longitude
//             latitudeDelta: 0.15,
//             longitudeDelta: 0.15,
//           }}
//           showsMyLocationButton={false}
//           showsCompass={false}
//           showsIndoors={false}
//           showsTraffic={false}
//           showsScale={false}
//           showsBuildings={false}
//           showsIndoorLevelPicker={false}
//           showsPointsOfInterest={false}
//           showsUserLocation
//           followsUserLocation>
//           {cameraData.map((camera, index) => (
//             <Marker
//               key={index}
//               coordinate={{
//                 latitude: parseFloat(
//                   camera.latitude || camera.location.latitude,
//                 ),
//                 longitude: parseFloat(
//                   camera.longitude || camera.location.longitude,
//                 ),
//               }}
//               title={camera.camera_type}
//               description={camera.location_description}
//               image={require('./src/assets/cam.png')}
//             >
      
//             </Marker>
//           ))}
//         </MapView>
     
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   centerMarkerContainer: {
//     left: '50%',
//     marginLeft: -15,
//     marginTop: -5,
//     // zIndex:1,
//     position: 'absolute',
//     top: '50%',
//   },
//   markerImage: {
//     width: 15, // Set the width of the custom image
//     height: 15, // Set the height of the custom image
//     resizeMode: 'contain', // Ensure the image is scaled proportionally
//   },
// });
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import {NavigationContainer} from '@react-navigation/native';
import Router from './src/navigation/Router';



const App = () => {
  return (
    <NavigationContainer >
    <Router />
  </NavigationContainer>

  )
}

export default App

const styles = StyleSheet.create({})