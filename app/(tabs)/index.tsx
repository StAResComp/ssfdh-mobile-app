import { Image, StyleSheet, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useSQLiteContext } from 'expo-sqlite';


export default function HomeScreen() {
	const [devConnected, setDevConnected] = useState(true);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [tracking, setTracking] = useState(false);
	const db = useSQLiteContext();
	const LOCATION_TASK_NAME = 'background-location-task';

	async function fetchlocation() {
		let { foregroundStatus } = await Location.requestForegroundPermissionsAsync();
		let { backgroundStatus } = await Location.requestBackgroundPermissionsAsync()
	}
	fetchlocation();

	async function handleLocationStartClick() {
		Alert.alert('Location Tracking Started')
		setTracking(true)
		 Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			 accuracy: Location.Accuracy.Balanced,
			 distanceInterval: 100,
			 timeInterval: 10000
		 });
	}


	const handleLocationEndClick = () => {
		if (tracking) {
			Alert.alert('Location Tracking Ended')
			Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
			setTracking(false)
		} else Alert.alert('Location Tracking Already Ended')
	}

	const getLocations = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM locations');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting locations : ', error);
		}
	}

	const getCatch = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM locations');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting catch : ', error);
		}
	}
	const deleteLocations = async () => {
		try {
			const allRows = await db.getAllAsync('DELETE FROM locations');
			console.log(allRows)
		} catch (error) {
			console.log('Error while deletinglocations : ', error);
		}
	}
	const addLocation = async (locations) => {
		let currtime = new Date().toISOString();
		try {
			const statement = await db.prepareAsync('INSERT INTO locations ( latitude, longitude, speed, heading, altitude, timestamp) VALUES (?,?,?,?,?,?)');
			await statement.executeAsync([locations[0].coords.latitude, locations[0].coords.longitude, locations[0].coords.speed, locations[0].coords.heading, locations[0].coords.altitude, currtime]);
		} catch (error) {
			console.log('Error while adding location : ', error);
		}
	};

	TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
		if (error) {
			// Error occurred - check `error.message` for more details.
			return;
		}
		if (data) {
			const locations = Object.values(data)[0];
			if (devConnected) {
				addLocation(locations)
				console.log(locations[0])
			} else { 
				console.log( locations[0])
			}
			setLocation(locations[0])
		}
	});


	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			if (state.isConnected) { setDevConnected(true) } else { setDevConnected(false) }

		});
		return () => unsubscribe();


	}, []);

	return (
		<ParallaxScrollView
		headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
		headerImage={
		<Image
		source={require('@/assets/images/pitcairn_001_transparent.png')}
		style={styles.reactLogo}
			/>
		}>
			<ThemedText type="defaultSemiBold"> Location Tracking: </ThemedText>
			<ThemedView>
				{!tracking && (
				<Button
					title="Tracking Start"
					color="#008000"
					onPress={() => handleLocationStartClick()}
				/>
				)}
				{tracking && (
				<Button
					title="Tracking End"
					color="#ff0000"
					onPress={() => handleLocationEndClick()}
					/>
				)}
			</ThemedView>
			{location && (
				<ThemedText type="defaultSemiBold"> Latitude: {location.coords.latitude} Longitude:{location.coords.longitude}  </ThemedText>
			)}
			<ThemedView style={{ flexDirection: 'row' }}>
				<ThemedView>
					<Button
						title="get DB Catch"
						color="#ff0000"
						onPress={() => getCatch()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="delete Locations"
						color="#ff0000"
						onPress={() => deleteLocations()}
					/>
				</ThemedView>
			</ThemedView>
			<ThemedView style={{ flexDirection: 'column', marginTop:60 }}>
				<ThemedView>
					<Button
						title="Submit Data"
						color="#008000"
						onPress={() => getLocations()}
					/>
				</ThemedView>
				<ThemedView style={{ marginTop: 60 }}>
					<Button
						title="Go to Website"
						color="#008000"
						onPress={() => getLocations()}
					/>
				</ThemedView>
			</ThemedView>
				
			{!devConnected && (
				<ThemedView>
					<ThemedText type="defaultSemiBold">
						You are offline.
					</ThemedText>
				</ThemedView>
		  )}
		  {devConnected && (
			  <ThemedView>
				  <ThemedText>
					  You are Online.
				  </ThemedText>
			  </ThemedView>
			)}
		</ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
