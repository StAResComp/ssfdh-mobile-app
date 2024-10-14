import { Image, StyleSheet, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import MapLibreGL from '@maplibre/maplibre-react-native';
import uuid from 'react-native-uuid';

export default function HomeScreen() {
	const [devConnected, setDevConnected] = useState(true);
	const [tracking, setTracking] = useState(false);
	const db = useSQLiteContext();
	const LOCATION_TASK_NAME = 'background-location-task';
	const progressListener = (offlineRegion:any, status:any) => console.log(offlineRegion, status);
	const errorListener = (offlineRegion: any, err: any) => console.log(offlineRegion, err);
	const speciesList = [{ scientificName: "Acanthocybium solandri", commmonName: "Wahoo", islandName: "Kuta", Score: 2 }, { scientificName: "Abudefduf sordidus", commmonName: "Blackspot sergeant", islandName: "Mummy", Score: 1 }, { scientificName: "Carangoides orthogrammus", commmonName: "Island trevally", islandName: "Ofe", Score: 1 }, { scientificName: "Caranx ignobilis", commmonName: "Giant trevally", islandName: "Ulwa(Giant)", Score: 1 }, { scientificName: "Caranx lugubris", commmonName: "Black trevally", islandName: "Ulwa(Black)", Score: 1 }, { scientificName: "Caranx melampygus", commmonName: "Bluefin trevally", islandName: " Ulwa(Bluefin)", Score: 1 }, { scientificName: "Chaetodon smithii", commmonName: "Smith’s butterflyfish", islandName: "Letas", Score: 1 }, { scientificName: "Coris aygula", commmonName: "Clown coris", islandName: "Miti", Score: 1 }, { scientificName: "Coris roseoviridis", commmonName: "Red-and green coris", islandName: "Elwyn’s Trousers", Score: 1 }, { scientificName: "Epinephelus fasciatus", commmonName: "Blacktip grouper", islandName: "Red Snapper", Score: 2 }, { scientificName: "Epinephelus hexagonatus", commmonName: "Hexagon grouper", islandName: "Rock Cod/Cod", Score: 1 }, { scientificName: "Epinephelus tauvina", commmonName: "Greasy grouper", islandName: "Rock Cod/Fiti Cod", Score: 1 }, { scientificName: "Kuhlia sandvicensis", commmonName: "Hawaiian flagtail", islandName: "Whitefish", Score: 1 }, { scientificName: "Kyphosus pacificus,", commmonName: "Gray drummer", islandName: "Nanwe", Score: 2 }, { scientificName: "Mullidae (Parupeneus & Mulloidichthys spp.)", commmonName: "Goatfish", islandName: "Beard-fish", Score: 1 }, { scientificName: "Scaridae (Scarus & Chlorurus spp.)", commmonName: "Parrotfish", islandName: " Uhu", Score: 1 }, { scientificName: "Seriola lalandi", commmonName: "Yellowtail Amberjack", islandName: "Kingie", Score: 1 }, { scientificName: "Thalassoma purpureum", commmonName: "Surge wrasse", islandName: "Puhu", Score: 1 }, { scientificName: "Thalassoma lutescens", commmonName: "Sunset wrasse", islandName: "Whistling Daughter", Score: 1 }, { scientificName: "Thunnus albacares", commmonName: "Yellow-fin tuna", islandName: "Yellowtail", Score: 2 }, { scientificName: "Xanthichthys mento", commmonName: "Crosshatch triggerfish", islandName: "Pick-Pick", Score: 1 }, {scientificName: "Variola louti", commmonName: "Yellow-edged lyretail", islandName: "Fafaia", Score:2}]


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

	const handleAddSpecies = async (list: any) => {
		speciesList.map((memSpecies: any, i: any) => {
			handleSpeciesDatabase(memSpecies)
			 }) 
	}

	async function handleSpeciesDatabase(species: any) {
		let speciesUID = uuid.v4()
		try {
			const statement = await db.prepareAsync('INSERT INTO species(speciesUuid,scientificName,commonName,islandName,score) VALUES (?,?,?,?,?)');
			await statement.executeAsync([speciesUID, species.scientificName, species.commmonName, species.islandName, species.Score]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}
	}

	const getSpecies = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM species');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting locations : ', error);
		}
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
	const getVerCatch = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM catchVerify');
			console.log(allRows)
		} catch (error) {
			console.log('Error while getting catch : ', error);
		}
	}
	const getCatchLink = async () => {
		try {
			const allRows = await db.getAllAsync('SELECT * FROM verLink');
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
			console.log('Error while deleteing catch : ', error);
		}
	}

	const deleteLocation = async () => {
		try {
			const allRows = await db.getAllAsync('DELETE FROM locations');
			console.log(allRows)
		} catch (error) {
			console.log('Error while deleting locations : ', error);
		}
	}
	const deleteGear = async () => {
		try {
			const allRows = await db.getAllAsync('DELETE FROM gear');
			console.log(allRows)
		} catch (error) {
			console.log('Error while deleting gear : ', error);
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
						title="Delete Map"
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
						title="show Species"
						color="#008000"
						onPress={() => getSpecies()}
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
						title="delete Loc"
						color="#ff0000"
						onPress={() => deleteLocation()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="delete Species"
						color="#ff0000"
						onPress={() => deleteGear()}
					/>
				</ThemedView>
				<ThemedView style={{ marginLeft: 20 }}>
					<Button
						title="delete Catch"
						color="#ff0000"
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

			<ThemedText> Add Species to DB</ThemedText>
			<ThemedView>
				<ThemedView>
					<Button
						title="Submit Species"
						color="#008000"
						onPress={() => handleAddSpecies(speciesList)}
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
