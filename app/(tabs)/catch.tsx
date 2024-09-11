import { Image, StyleSheet, Button, Pressable, TextInput, useColorScheme,Switch } from 'react-native';
import { useState} from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSQLiteContext } from 'expo-sqlite';

MapLibreGL.setAccessToken(null);

export default function HomeScreen() {
	const [fishLocation, setfishLocation] = useState(false); 
	const [mapLocation, setMapLocation] = useState(false); 
	const [catchTime, setCatchTime] = useState(false); 
	const [gearType, setGearType] = useState(false); 
	const [selectedSpecies, setSelectedSpecies] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const[date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);
	const [retRun, setRetRun] = useState(false);
	const [indBulk, setIndBulk] = useState(false);
	const [optionalBulk, setOptionalBulk] = useState(false);
	const [bulkType, setBulkType] = useState(false);
	const [indNum, setIndNum] = useState(false);
	const [bulkNum, setBulkNum] = useState(false);

	const [isAccurate, setIsAccurate] = useState(false);
	const toggleSwitch = () => setIsAccurate(previousState => !previousState);


	const db = useSQLiteContext();
	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';

	async function handleLocationClick() {
		let curloc = await Location.getCurrentPositionAsync()
		const currtime = new Date();
		setfishLocation(curloc)
		setCatchTime(currtime)
	}

	async function onMapLocation () {
		let curloc = await Location.getCurrentPositionAsync()
		setMapLocation(curloc)
	};


	const handleMapDate = () => {
		setfishLocation(mapLocation)
		setShowMap(false)
	};

	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setDate(currentDate);
		setCatchTime(currentDate)
		setShow(false);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

	const showTimepicker = () => {
		showMode('time');
	};

	function mapOnPress(event) {
		const { geometry, properties } = event;
		console.log(geometry)
		/*this.setState({
			latitude: geometry.coordinates[1],
			longitude: geometry.coordinates[0],
			screenPointX: properties.screenPointX,
			screenPointY: properties.screenPointY,
		});*/
	}

	const handleIndividualChange = (text) => {
		setIndNum(text)
	}
	const handleBulkChange = (text) => {
		setBulkNum(text)
	}


	const handleGearClick = (type) => {
		setGearType(type)
	}


	async function handleStoreData(fishLocation, catchTime, gearType, selectedSpecies, retRun, bulkType, indBulk, indNum, bulkNum,isAccurate) {
		/*try {
			const statement = await db.prepareAsync('INSERT INTO Catch(latitude, longitude, date, gearType, species, metric, retained, returned ) VALUES (?,?,?,?,?,?,?,?)');
			await statement.executeAsync([fishLocation.coords.latitude, fishLocation.coords.longitude, catchTime.toISOString(), gearType, selectedSpecies, selectedMetric, retained, returned]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}*/
		setfishLocation(false)
		setCatchTime(false)
		setGearType(false)
		setSelectedSpecies(false)
		setRetRun(false)
		setIndBulk(false)
		setIndNum(false)
		setBulkType(false)
		setBulkNum(false)
		setIsAccurate(false)
		setShowMap(false)
	}


	async function handleStoreDataAdditional(fishLocation, catchTime, gearType, selectedSpecies, retRun, bulkType, indBulk, indNum, bulkNum, isAccurate) {
		/*try {
			const statement = await db.prepareAsync('INSERT INTO Catch(latitude, longitude, date, gearType, species, metric, retained, returned ) VALUES (?,?,?,?,?,?,?,?)');
			await statement.executeAsync([fishLocation.coords.latitude, fishLocation.coords.longitude, catchTime.toISOString(), gearType, selectedSpecies, selectedMetric, retained, returned]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}*/
		setSelectedSpecies(false)
		setRetRun(false)
		setIndBulk(false)
		setIndNum(false)
		setBulkType(false)
		setBulkNum(false)
		setIsAccurate(false)
		setShowMap(false)
	}


	const handleDeleteClick = (deleteType) => {
		if (deleteType == "location") {
			setfishLocation(false)
			setCatchTime(false)
		} else if (deleteType == "gear") {
			setGearType(false)
		}
		else if (deleteType == "species") {
			setSelectedSpecies(false)
		} else if (deleteType == "retRun") {
			setRetRun(false)
			setIndBulk(false)
			setOptionalBulk(false)
			setBulkType(false)
			setIndNum(false)
			setBulkNum(false)
			setIsAccurate(false)
		}else if (deleteType == "all") {
			setfishLocation(false)
			setCatchTime(false)
			setGearType(false)
			setSelectedSpecies(false)
			setRetRun(false)
			setIndBulk(false)
			setOptionalBulk(false)
			setBulkType(false)
			setIndNum(false)
			setBulkNum(false)
			setShowMap(false)
			setIsAccurate(false)
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
		<ThemedView>
		{(!fishLocation && !showMap) && (
		<ThemedView style={{ flexDirection: 'column', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
			<ThemedText type="title"> CATCH DATA INPUT </ThemedText>
			<ThemedView style={{ flexDirection: 'column', marginTop: 80 }}>
				<Button
					title="Get Current Location"
					color="#008000"
					onPress={() => handleLocationClick()}
				/>
			</ThemedView>
			<ThemedView style={{ flexDirection: 'column', marginTop: 80 }}>
				<Button
					title="Location From Map"
					color="#008000"
					onPress={() => setShowMap(!showMap)}
				/>
			</ThemedView>
		</ThemedView>
				)}
		{(showMap) && (
		<ThemedView style={{ flexDirection: 'column', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
			<ThemedView style={{ flexDirection: 'column'}}>
							<MapLibreGL.MapView
								style={styles.map}
								logoEnabled={false}
								onPress={mapOnPress}
							 	styleURL="https://demotiles.maplibre.org/style.json"
							>
								<MapLibreGL.Camera centerCoordinate={[-128.32801214367845, -24.361464638078317]} zoomLevel={7} />
							</MapLibreGL.MapView>
				<Button
					title="Pretend Map"
					color="#008000"
					onPress={() => onMapLocation()}
				/>
			</ThemedView>
			<ThemedView style={{ flexDirection: 'column', marginTop: 80 }}>
				<ThemedView style={{marginBottom: 60}}>
					<Button onPress={showDatepicker} color="#008000" title="Show date picker!" />
				</ThemedView>
					<Button onPress={showTimepicker} color="#008000" title="Show time picker!" />
			</ThemedView>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={mode}
						is24Hour={true}
						onChange={onDateChange}
					/>
						)}
				{mapLocation && (
					<ThemedText type="defaultSemiBold"> Latitude: {mapLocation.coords.latitude} Longitude:{mapLocation.coords.longitude}  </ThemedText>
						)}
				{catchTime && (
					<ThemedText type="defaultSemiBold"> Time: {catchTime.toLocaleString()} </ThemedText>
				)}	
			{(mapLocation && catchTime) && (
					<ThemedView style={{ marginTop: 60 }}>
						<Button onPress={handleMapDate} color="#008000" title="Enter Data" />
					</ThemedView>	
						)}
			<ThemedView style={{ marginTop: 60 }}>
				<Button
					title="Back to Start"
					color="#ff0000"
					onPress={() => handleDeleteClick("all")}
				/>
			</ThemedView>
		</ThemedView>
	)}
		{(fishLocation && !gearType) && (
			<ThemedView>
				<ThemedView style={{flexDirection: 'column', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
					<Pressable onPress={() => { handleGearClick("rod"); }} style={({ pressed }) => [
						{
						width: 150,
						height: 150
						},
						]}>
						<Image source={require('@/assets/images/rod_line_transparent.png')} style={{ width: 150, height: 150 }} />
							</Pressable>
			
					<Pressable onPress={() => { handleGearClick("longline"); }} style={({ pressed }) => [
						{
						width: 150,
						height: 150,
						},
						]}>
							<Image source={require('@/assets/images/longline_transparent.png')} style={{ width: 150, height: 150 }} />
					</Pressable>
					<Pressable onPress={() => { handleGearClick("net"); }} style={({ pressed }) => [
						{
						width: 150,
						height: 150,
						},
					]}>
						<Image source={require('@/assets/images/net_transparent.png')} style={{ width: 150, height: 150 }} />
					</Pressable>
				</ThemedView>
				 <ThemedView style ={{marginTop:40}}>
					<Button
						title="Reselect Location"
						color="#ff0000"
						onPress={() => handleDeleteClick("location")}
					/>
				</ThemedView>
			</ThemedView>
		)}
		{(gearType && !selectedSpecies) && (
			<ThemedView>
				<ThemedText type="defaultSemiBold"> Species Select: </ThemedText>
					<Picker
					style={{ color: textColor[colorScheme]}}
					mode="dropdown"
					dropdownIconColor={textColor[colorScheme]}
					selectedValue={selectedSpecies}
					onValueChange={(itemValue, itemIndex) =>
						setSelectedSpecies(itemValue)
					}>
						<Picker.Item label="Fish 1" value="fish 1" />
						<Picker.Item label="Fish 2" value="fish 2" />
				</Picker>
				<ThemedView style={{ marginTop: 240, marginBottom: 20}}>
					<Button
						title="Reselect Gear"
						color="#ff0000"
						onPress={() => handleDeleteClick("gear")}
					/>
				</ThemedView>
			</ThemedView>		
				)}
		{(selectedSpecies && !retRun) && (
			<ThemedView>
				<ThemedText type="defaultSemiBold">Retained/Returned Select: </ThemedText>
				<Picker
				style={{ color: textColor[colorScheme] }}
				mode="dropdown"
				dropdownIconColor={textColor[colorScheme]}
				selectedValue={retRun}
				onValueChange={(itemValue, itemIndex) =>
					setRetRun(itemValue)
				}>
					<Picker.Item label="Retained/Returned" value="Retained/Returned" />
					<Picker.Item label="Retained" value="Retained" />
					<Picker.Item label="Returned" value="Returned" />
				</Picker>
				<ThemedView style={{ marginTop: 240, marginBottom: 20 }}>
						<Button
							title="Reselect Species"
							color="#ff0000"
								onPress={() => handleDeleteClick("species")}
						/>
				</ThemedView>
				</ThemedView>
				)}
		{retRun && (
			<ThemedView>	
				<ThemedText type="defaultSemiBold"> Metric Select: </ThemedText>
				<Picker
				style={{ color: textColor[colorScheme] }}
				mode="dropdown"
				dropdownIconColor={textColor[colorScheme]}
				selectedValue={indBulk}
				onValueChange={(itemValue, itemIndex) =>
					setIndBulk(itemValue)
				}>
				<Picker.Item label="Individual/Bulk" value="Ind/Bulk" />
				<Picker.Item label="Individual" value="Individual" />
				<Picker.Item label="Bulk" value="Bulk" />
				</Picker>
				{(indBulk == "Individual") && (
				<ThemedView>
					<ThemedView style={{ marginTop: 30 }}>
						<ThemedText type="defaultSemiBold"> Retained: </ThemedText>
					<TextInput keyboardType='numeric' value={indNum} style={{ color: textColor[colorScheme] }} placeholder="Retained" placeholderTextColor={textColor[colorScheme]} onChangeText={handleIndividualChange} />
					</ThemedView> 
					{(!optionalBulk) && (
						<>	
						<ThemedView style={{ marginTop: 40, marginBottom: 10 }}>
							<Button
								title="Add Bulk Quantity"
								color="#008000"
								onPress={() => setOptionalBulk(true)}
							/>
						</ThemedView>
						</>	
								)}
					{(optionalBulk) && (
						<ThemedView style={{ marginTop: 30 }} >
							<ThemedText type="defaultSemiBold"> Bulk Select: </ThemedText>
							<Picker
								style={{ color: textColor[colorScheme] }}
								mode="dropdown"
								dropdownIconColor={textColor[colorScheme]}
								selectedValue={bulkType}
								onValueChange={(itemValue, itemIndex) =>
									setBulkType(itemValue)
							}>
								<Picker.Item label="Choose Metric" value="Choose Metric" />
								<Picker.Item label="Kg" value="Kg" />
								<Picker.Item label="lb" value="lb" />
							</Picker>
							<ThemedView style={{ flexDirection: 'row', marginTop: 20 }}>
								<ThemedView>
									<ThemedText type="defaultSemiBold">Number: </ThemedText>
									<TextInput keyboardType='numeric' value={bulkNum} style={{ color: textColor[colorScheme] }} placeholder="Bulk Number" placeholderTextColor={textColor[colorScheme]} onChangeText={handleBulkChange} />
								</ThemedView>
								<ThemedView style={{ marginLeft: 100 }}>
									<ThemedText type="defaultSemiBold">Accurate: </ThemedText>
									<Switch
										trackColor={{ false: '#767577', true: '#81b0ff' }}
										thumbColor={isAccurate ? '#f5dd4b' : '#f4f3f4'}
										onValueChange={toggleSwitch}
										value={isAccurate}
									/>
								</ThemedView>
							</ThemedView>
						</ThemedView>
					)}
				</ThemedView>
				)}
				{(indBulk == "Bulk") && (
					<ThemedView style={{ marginTop: 30 }} >
						<ThemedText type="defaultSemiBold"> Bulk Select: </ThemedText>
						<Picker
						style={{ color: textColor[colorScheme] }}
						mode="dropdown"
						dropdownIconColor={textColor[colorScheme]}
						selectedValue={bulkType}
						onValueChange={(itemValue, itemIndex) =>
							setBulkType(itemValue)
						}>
							<Picker.Item label="Choose Metric" value="Choose Metric" />
							<Picker.Item label="Kg" value="Kg" />
							<Picker.Item label="lb" value="lb" />
						</Picker>
					<ThemedView style={{ flexDirection: 'row', marginTop: 20}}>
						<ThemedView>
							<ThemedText type="defaultSemiBold">Number: </ThemedText>
							<TextInput keyboardType='numeric' value={bulkNum} style={{ color: textColor[colorScheme] }} placeholder="Bulk Number" placeholderTextColor={textColor[colorScheme]} onChangeText={handleBulkChange} />
						</ThemedView>
						<ThemedView style={{  marginLeft: 100 }}>
							<ThemedText type="defaultSemiBold">Accurate: </ThemedText>
							<Switch
								trackColor={{ false: '#767577', true: '#81b0ff' }}
								thumbColor={isAccurate ? '#f5dd4b' : '#f4f3f4'}
								onValueChange={toggleSwitch}
								value={isAccurate}
							/>
						</ThemedView>
					</ThemedView>
				</ThemedView>
				)}
				<ThemedView style={{ marginTop: 40, marginBottom: 10 }}>
					<Button
						title="Reselect Retained/Returned"
						color="#ff0000"
						onPress={() => handleDeleteClick("retRun")}
					/>
				</ThemedView>
			</ThemedView>
			)}
				
			{(fishLocation && !showMap) && (
				<ThemedText type="defaultSemiBold"> Latitude: {fishLocation.coords.latitude} Longitude:{fishLocation.coords.longitude}  </ThemedText>
			)}
			{(catchTime && !showMap) && (
				<ThemedText type="defaultSemiBold"> Time: {catchTime.toLocaleString()} </ThemedText>
				)}
			{gearType && (
				<ThemedText type="defaultSemiBold"> Gear: {gearType} </ThemedText>
				)}
			{selectedSpecies && (
				<ThemedText type="defaultSemiBold"> Species: {selectedSpecies} </ThemedText>
				)}
			{(retRun) && (
				<ThemedText type="defaultSemiBold"> Retained/Returned: {retRun} </ThemedText>
				)}
			{(indNum && !bulkNum) && (
					<ThemedText type="defaultSemiBold"> Individuals: {indNum} </ThemedText>
				)}
			{(bulkType) && (
					<ThemedText type="defaultSemiBold"> Bulk Type: {bulkType} </ThemedText>
				)}
			{(bulkNum && !indNum) && (
					<ThemedText type="defaultSemiBold"> Bulk Number: {bulkNum} </ThemedText>
				)}
			{(bulkNum && indNum) && (
					<ThemedText type="defaultSemiBold"> Individuals: {indNum} Bulk Number: {bulkNum} </ThemedText>
				)}
			{(isAccurate && (indNum || bulkNum )) && (
					<ThemedText type="defaultSemiBold"> Accurate </ThemedText>
				)}
			{(!isAccurate && (indNum || bulkNum)) && (
					<ThemedText type="defaultSemiBold"> Estimated </ThemedText>
				)}
		{(indBulk == "Individual" && indNum ) && (
			<ThemedView style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
				<Button
					title="Add Species"
					color="#008000"
					onPress={() => handleDeleteClick("all")}
				/>
			<ThemedView style={{ marginLeft: 40 }}>
				<Button
					title="Add Another Species"
					color="#008000"
					onPress={() => handleDeleteClick("all")}
				/>
				</ThemedView>
					</ThemedView>)}
		{(indBulk == "Bulk" && bulkNum) && (
			<ThemedView style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
				<Button
					title="Add Species"
					color="#008000"
					onPress={() => handleDeleteClick("all")}
				/>
				<ThemedView style={{ marginLeft: 40 }}>
					<Button
						title="Add Another Species"
						color="#008000"
						onPress={() => handleDeleteClick("all")}
					/>
				</ThemedView>
			</ThemedView>)}

		{(gearType) && (
					<ThemedView style={{ marginTop: 40 }}>
						<Button
							title="Back to Start"
							color="#ff0000"
							onPress={() => handleDeleteClick("all")}
						/>
					</ThemedView>)}
		</ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	imagecontainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
	map: {
		height: 290,
		width: 400,
	},
});
