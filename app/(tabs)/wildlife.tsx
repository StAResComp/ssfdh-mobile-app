import { Image, StyleSheet, Button, Pressable, TextInput, useColorScheme } from 'react-native';
import { useState} from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeScreen() {
	const [sightLocation, setSightLocation] = useState(false); 
	const [catchTime, setCatchTime] = useState(false); 
	const [distance, setDistance] = useState(false); 
	const [selectedSpecies, setSelectedSpecies] = useState(false);
	const [numberSeen, setNumberSeen] = useState(false);
	const [comment, setComment] = useState(false);
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const [mapLocation, setMapLocation] = useState(false); 

	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';

	async function handleLocationClick() {
		let curloc = await Location.getCurrentPositionAsync()
		const currtime = new Date();
		setSightLocation(curloc)
		setCatchTime(currtime)
	}


	async function onMapLocation() {
		let curloc = await Location.getCurrentPositionAsync()
		setMapLocation(curloc)
	};


	const handleMapDate = () => {
		setSightLocation(mapLocation)
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


	const handleNumber = (text) => {
		setNumberSeen(text)
	}

	const handleComment = (text) => {
		setComment(text)
	}

	const handleDeleteClick = (deleteType) => {
		if (deleteType == "location") {
			setSightLocation(false)
			setCatchTime(false)
		} else if (deleteType == "distance") {
			setDistance(false)
		}
		else if (deleteType == "species") {
			setSelectedSpecies(false)
		}  else if (deleteType == "all") {
			setSightLocation(false)
			setCatchTime(false)
			setDistance(false)
			setSelectedSpecies(false)
			setNumberSeen(false)
			setComment(false)
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
		{(!sightLocation && !showMap) && (
		<ThemedView style={{ flexDirection: 'column', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
			<ThemedText type="title"> WILDLIFE SIGHTINGS </ThemedText>
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
						<ThemedView style={{ flexDirection: 'column', marginTop: 80 }}>
							<Button
								title="Pretend Map"
								color="#008000"
								onPress={() => onMapLocation()}
							/>
						</ThemedView>
						<ThemedView style={{ flexDirection: 'column', marginTop: 80 }}>
							<ThemedView style={{ marginBottom: 60 }}>
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
				{(sightLocation && !distance) && (
				<ThemedView style={{ marginTop: 40, marginBottom: 40 }}>
					<Picker
						style={{ color: textColor[colorScheme] }}
						mode="dropdown"
						dropdownIconColor={textColor[colorScheme]}
						selectedValue={distance}
						onValueChange={(itemValue, itemIndex) =>
							setDistance(itemValue)
						}>
								<Picker.Item label="Distance" value="Distance" />
								<Picker.Item label="0" value="0" />
								<Picker.Item label="0-1000" value="1000" />
								<Picker.Item label="1000-2000" value="2000" />
								<Picker.Item label="2000-3000" value="3000" />
					</Picker>
				<ThemedView style={{ marginTop: 240, marginBottom: 20}}>
					<Button
						title="Reselect Location"
						color="#ff0000"
						onPress={() => handleDeleteClick("location")}
					/>
				</ThemedView>
			</ThemedView>
		)}
		{(distance && !selectedSpecies) && (
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
					<ThemedView style={{ marginTop: 240, marginBottom: 40 }}>
					<Button
						title="Reselect Distance"
						color="#ff0000"
						onPress={() => handleDeleteClick("distance")}
					/>
				</ThemedView>
			</ThemedView>		
				)}
		{(selectedSpecies) && (
					<ThemedView>
						<ThemedView>
							<ThemedText type="defaultSemiBold"> Number: </ThemedText>
							<TextInput keyboardType='numeric' value={numberSeen} style={{ color: textColor[colorScheme] }} placeholder="Retained" onChangeText={handleNumber} />
						</ThemedView>
						<ThemedView style={{ marginTop: 40 }}>
							<ThemedText type="defaultSemiBold"> Comment: </ThemedText>
							<TextInput
								multiline={true}
								numberOfLines={10}
								value={comment}
								style={{ height: 50, textAlignVertical: 'top', color: textColor[colorScheme] }}
								placeholder="Comment"
								onChangeText={handleComment} />
						</ThemedView>
						<ThemedView style={{ marginTop: 60, marginBottom: 20 }}>
						<Button
							title="Reselect Species"
							color="#ff0000"
							onPress={() => handleDeleteClick("species")}
							/>
						</ThemedView>
					</ThemedView>
				)}

			{sightLocation && (
					<ThemedText type="defaultSemiBold"> Latitude: {sightLocation.coords.latitude} Longitude:{sightLocation.coords.longitude} Bearing:{sightLocation.coords.heading} </ThemedText>
			)}
			{catchTime && (
					<ThemedText type="defaultSemiBold"> Time: {catchTime.toLocaleString()} </ThemedText>
				)}
			{distance && (
					<ThemedText type="defaultSemiBold"> Distance: {distance} </ThemedText>
				)}
			{selectedSpecies && (
					<ThemedText type="defaultSemiBold"> Species: {selectedSpecies} </ThemedText>
				)}
			{(numberSeen) && (
					<ThemedText type="defaultSemiBold"> number:{numberSeen} </ThemedText>
				)}
				{(sightLocation && catchTime && distance && selectedSpecies && numberSeen ) && (
					<>
						<ThemedView style={{
							marginTop:20
						}}>
						<Button
							title="Add Sighting"
							color="#008000"
							onPress={() => handleDeleteClick("all")}
						/>
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
		{(distance && !numberSeen) && (
					<ThemedView style={{ marginTop: 20 }}>
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
});
