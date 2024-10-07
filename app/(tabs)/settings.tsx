import { Image, StyleSheet, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useSQLiteContext } from 'expo-sqlite';
import MapLibreGL from '@maplibre/maplibre-react-native';

export default function HomeScreen() {
	const [devConnected, setDevConnected] = useState(true);
	const [tracking, setTracking] = useState(false);
	const db = useSQLiteContext();
	const LOCATION_TASK_NAME = 'background-location-task';
	const progressListener = (offlineRegion:any, status:any) => console.log(offlineRegion, status);
	const errorListener = (offlineRegion:any, err:any) => console.log(offlineRegion, err);


	async function handleGetMap(progressListener:any, errorListener:any) {
		await MapLibreGL.offlineManager.createPack({
			name: 'PitcairnPack',
			styleURL:'https://fishing-test.st-andrews.ac.uk/geoserver/gwc/service/wmts?SERVICE=WMTS&&VERSION=1.0.0&REQUEST=GetTile&layer=ssfdh:scotland_mpa&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}',
			minZoom: 6,
			maxZoom: 12,
			bounds: [[-128.03063359873957, -23.658636827301535], [-130.42936197297047, -25.238391606794014]]
		}, progressListener, errorListener)
	}

	async function handleShowMap() {
		const offlinePacks = await MapLibreGL.offlineManager.getPacks();
		console.log(offlinePacks)
	}

	async function handleDeleteMap() {
		await MapLibreGL.offlineManager.deletePack('PitcairnPack')
	}

	const getLocations = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM locations');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting locations : ', error);
		}
	}

	const getGear = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM gear');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting catch : ', error);
		}
	}
	const getCatch= async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM catch');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting catch : ', error);
		}
	}

	const deleteCatch = async () => {
		try {
			const allRows = await db.getAllAsync('DELETE FROM catch');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting catch : ', error);
		}
	}
	
	return (
		<ParallaxScrollView
		headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
		headerImage={
		<Image
		source={require('@/assets/images/pitcairn_001_transparent.png')}
		style={styles.reactLogo}
			/>
		}>
			<ThemedText> Offline Map Pack</ThemedText>
			<ThemedView style={{ flexDirection: 'row', marginBottom:20 }}>
				<ThemedView>
					<Button
						title="get Map"
						color="#008000"
						onPress={() => handleGetMap(progressListener, errorListener)}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="show Map"
						color="#008000"
						onPress={() => handleShowMap()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="DeleteMap"
						color="#ff0000"
						onPress={() => handleDeleteMap()}
					/>
				</ThemedView>
			</ThemedView>

			<ThemedText> Phone Data Check</ThemedText>
			<ThemedView style={{ flexDirection: 'row', marginBottom:20 }}>
				<ThemedView>
					<Button
						title="show Loc"
						color="#008000"
						onPress={() => getLocations()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="show Gear"
						color="#008000"
						onPress={() => getGear()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="show Catch"
						color="#008000"
						onPress={() => getCatch()}
					/>
				</ThemedView>
			</ThemedView>


			<ThemedText> Phone Data Delete</ThemedText>
			<ThemedView style={{ flexDirection: 'row', marginBottom: 20 }}>
				<ThemedView>
					<Button
						title="show Loc"
						color="#008000"
						onPress={() => getLocations()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="show Gear"
						color="#008000"
						onPress={() => getGear()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="delete Catch"
						color="#008000"
						onPress={() => deleteCatch()}
					/>
				</ThemedView>
			</ThemedView>
			<ThemedText> Submit data to SSFDH</ThemedText>
			<ThemedView>
				<ThemedView>
					<Button
						title="Submit Data"
						color="#008000"
						onPress={() => getCatch()}
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
