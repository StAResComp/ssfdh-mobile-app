import { Image, StyleSheet, Button, Pressable, TextInput, useColorScheme } from 'react-native';
import { useState} from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);

export default function HomeScreen() {
	const [fishLocation, setfishLocation] = useState(false); 
	const [mapLocation, setMapLocation] = useState(false); 
	const [catchTime, setCatchTime] = useState(false); 
	const [gearType, setGearType] = useState(false); 
	const [selectedSpecies, setSelectedSpecies] = useState(false);
	const [selectedMetric, setSelectedMetric] = useState(false);
	const [retained, setRetained] = useState(false);
	const [returned, setReturned] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const[date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

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

	const handleRetainedChange = (text) => {
		setRetained(text)
	}
	const handleReturnedChange = (text) => {
		setReturned(text)
	}
	const handleGearClick = (type) => {
		setGearType(type)
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
			setSelectedMetric(false)
			setRetained(false)
			setReturned(false)
		}  else if (deleteType == "all") {
			setfishLocation(false)
			setCatchTime(false)
			setGearType(false)
			setSelectedSpecies(false)
			setSelectedMetric(false)
			setRetained(false)
			setReturned(false)
			setShowMap(false)
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
		{( showMap) && (
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
		{selectedSpecies && (
					<ThemedView>
						<ThemedText type="defaultSemiBold"> Metric Select: </ThemedText>
						<Picker
							style={{ color: textColor[colorScheme] }}
							mode="dropdown"
							dropdownIconColor={textColor[colorScheme]}
							selectedValue={selectedMetric}
							onValueChange={(itemValue, itemIndex) =>
								setSelectedMetric(itemValue)
							}>
							<Picker.Item label="Metrics" value="Metric" />
							<Picker.Item label="Metric 1" value="Metric 1" />
							<Picker.Item label="Metric 2" value="Metric 2" />
						</Picker>
						<ThemedView style={{ marginTop: 30 }}>
							<ThemedText type="defaultSemiBold"> Retained: </ThemedText>
							<TextInput keyboardType='numeric' value={retained} style={{ color: textColor[colorScheme] }} placeholder="Retained" placeholderTextColor={textColor[colorScheme]} onChangeText={handleRetainedChange} />
						</ThemedView> 
						<ThemedView style={{ marginTop: 30 }}>
							<ThemedText type="defaultSemiBold"> Returned: </ThemedText>
							<TextInput keyboardType='numeric' value={returned} style={{ color: textColor[colorScheme] }} placeholder="Returned" placeholderTextColor={textColor[colorScheme]} onChangeText={handleReturnedChange} />
						</ThemedView> 
						<ThemedView style={{ marginTop: 40, marginBottom: 10 }}>
						<Button
							title="Reselect Species"
							color="#ff0000"
							onPress={() => handleDeleteClick("species")}
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
			{selectedMetric && (
				<ThemedText type="defaultSemiBold"> Metric: {selectedMetric} </ThemedText>
				)}
			{(retained && returned) && (
				<ThemedText type="defaultSemiBold"> Retained: {retained}  Returned:{returned} </ThemedText>
			)}
			{(fishLocation && catchTime && gearType && selectedSpecies && selectedMetric && retained && returned) && (
				<>
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
								onPress={() => handleDeleteClick("species")}
							/>
						</ThemedView>
					</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Cancel"
								color="#ff0000"
								onPress={() => handleDeleteClick("all")}
							/>
					</ThemedView>
				</>
			)}
		{(gearType && !returned) && (
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
