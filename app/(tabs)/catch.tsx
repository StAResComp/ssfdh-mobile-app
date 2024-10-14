import { Image, StyleSheet, Button, Pressable, TextInput, useColorScheme,Switch } from 'react-native';
import { useState, useEffect} from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';

MapLibreGL.setAccessToken(null);

interface fLocation {
	latitude: number;
	longitude: number;
	
}

export default function HomeScreen() {
	const [fishLocation, setfishLocation] = useState<fLocation >(); 
	const [hasLocation, setHasLocation] = useState<boolean>(); 
	const [catchTime, setCatchTime] = useState<any>(); 
	const [gearType, setGearType] = useState<string | boolean>(); 
	const [gear, setGear] = useState<any>();
	const [selectedSpecies, setSelectedSpecies] = useState<any>();
	const [showMap, setShowMap] = useState<boolean>();
	const [date, setDate] = useState<any>(new Date());
	const [mode, setMode] = useState<any>('date');
	const [show, setShow] = useState<boolean>();
	const [retRun, setRetRun] = useState<string | boolean>();
	const [indBulk, setIndBulk] = useState<string | boolean>();
	const [optionalBulk, setOptionalBulk] = useState<any>();
	const [bulkType, setBulkType] = useState<string | boolean>();
	const [indNum, setIndNum] = useState<any>();
	const [bulkNum, setBulkNum] = useState<any>();
	const [gearList, setGearList] = useState<any>();
	const [speciesList, setSpeciesList] = useState<any>();
	const [isAccurateInd, setIsAccurateInd] = useState<boolean>(false);
	const [isAccurateBulk, setIsAccurateBulk] = useState<boolean>(false);
	const [isPersonal, setIsPersonal] = useState<boolean>(false);
	const [isVerified, setIsVerfified] = useState<boolean>(false);
	const [indLength, setIndLength] = useState<any>();
	const [indWeight, setIndWeight] = useState<any>();
	const [charList, setCharList] = useState<any | boolean>();


	const toggleSwitchInd = () => setIsAccurateInd(previousState => !previousState);
	const toggleSwitchBulk = () => setIsAccurateBulk(previousState => !previousState);

	const db = useSQLiteContext();
	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';

	const fetchGear = async () => {
		const data = await db.getAllAsync('SELECT * FROM gear WHERE visible = 1');
		setGearList(data);
	}

	const fetchSpecies = async () => {
		const data = await db.getAllAsync('SELECT * FROM species ORDER BY score DESC');
		setSpeciesList(data);
	}

	useEffect(() => {
		fetchGear()
		fetchSpecies()
	}, [gearType]);

	useEffect(() => {
		if (retRun == "Returned") { setIsVerfified(true)}
	}, [retRun]);

	console.log(selectedSpecies)

	async function handleLocationClick() {
		let curloc = await Location.getCurrentPositionAsync()
		const currtime = new Date();
		setfishLocation({ latitude: curloc.coords.latitude, longitude: curloc.coords.longitude })
		setCatchTime(currtime)
		setHasLocation(true)
	}

	const handleMapDate = () => {
		setShowMap(false)
		setHasLocation(true)
	};

	const onDateChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate;
		setDate(currentDate);
		setCatchTime(currentDate)
		setShow(false);
	};

	const showMode = (currentMode: any) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

	const showTimepicker = () => {
		showMode('time');
	};

	function mapOnPress(event:any) {
		const { geometry, properties } = event;
		setfishLocation({ latitude: geometry.coordinates[1], longitude: geometry.coordinates[0] })
		/*
			latitude: geometry.coordinates[1],
			longitude: geometry.coordinates[0],
			screenPointX: properties.screenPointX,
			screenPointY: properties.screenPointY,
		*/
	}

	const handleIndividualChange = (text: any) => {
		setIndNum(text)
	}
	const handleBulkChange = (text: any) => {
		setBulkNum(text)
	}
	const handlePersonalChange = (text: any) => {
		setIsPersonal(text)
	}
	const handleVerifiedChange = (text: any) => {
		setIsVerfified(text)
	}
	const handleIndLengthChange = (text: any) => {
		setIndLength(text)
	}
	const handleIndWeightChange = (text: any) => {
		setIndWeight(text)
	}


	const handleAddLength = () => {
		let indUid = uuid.v4()
		if (charList) {
			if (charList.length <= indNum) { setCharList([...charList, { len: indLength, weight: indWeight, indUuid: indUid }]) }
			else {console.log("More entries than individuals")}
		
		} else {
			setCharList([{ len: indLength, weight: indWeight, indUuid: indUid }])
		}
	}

	const handleDeleteLength = () => {
		if (charList) {
			let tempCharList = charList;
			tempCharList.pop();
			setCharList([tempCharList])
		}
	}




	async function handleStoreData(fishLocation: any, catchTime: any, gear: any, selectedSpecies: any, retRun: any, bulkType: any, indNum: any, charList: any, bulkNum: any, isAccurateInd: any, isAccurateBulk: any, isPersonal: any, isVerified: any) {
		let catchUUID = uuid.v4()
		let score = (selectedSpecies.score + 1) 
		try {
			const statement = await db.prepareAsync('INSERT INTO Catch(catchUuid, latitude, longitude, date, gearUuid, species, retRun, indNum, characteristics, bulkType, bulkNum, accurateInd,accurateBulk, personal, shipVer ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
			await statement.executeAsync([catchUUID, fishLocation.latitude, fishLocation.longitude, catchTime.toISOString(), gear, selectedSpecies.commonName, retRun, indNum, charList, bulkType, bulkNum, isAccurateInd, isAccurateBulk, isPersonal, isVerified]);
			const statement2 = await db.prepareAsync('UPDATE species SET score = ? WHERE speciesUuid = ?');
			await statement2.executeAsync([score, selectedSpecies.speciesUuid]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}
		setfishLocation({ latitude: 0, longitude: 0 })
		setCatchTime(false)
		setGearType(false)
		setGear(false)
		setSelectedSpecies(false)
		setSpeciesList(false)
		setRetRun(false)
		setIndBulk(false)
		setIndNum(false)
		setBulkType(false)
		setOptionalBulk(false)
		setBulkNum(false)
		setIsAccurateInd(false)
		setIsAccurateBulk(false)
		setShowMap(false)
		setCharList(false)
		setHasLocation(false)
		setIndLength(false)
		setIndWeight(false)
		fetchGear()
		fetchSpecies()
	}


	async function handleStoreDataAdditional(fishLocation: any, catchTime: any, gear: any, selectedSpecies: any, retRun: any, bulkType: any, indNum: any, lengthList: any, bulkNum: any, isAccurateInd: any, isAccurateBulk: any, isPersonal: any, isVerified: any) {
		let catchUUID = uuid.v4()
		let score = (selectedSpecies.score + 1) 
		try {
			const statement = await db.prepareAsync('INSERT INTO Catch(catchUuid, latitude, longitude, date, gearUuid, species, retRun, indNum, characteristics,  bulkType, bulkNum, accurateInd,accurateBulk, personal,shipVer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
			await statement.executeAsync([catchUUID, fishLocation.latitude, fishLocation.longitude, catchTime.toISOString(), gear, selectedSpecies.commonName, retRun, indNum, lengthList, bulkType, bulkNum, isAccurateInd, isAccurateBulk, isPersonal, isVerified]);
			const statement2 = await db.prepareAsync('UPDATE species SET score = ? WHERE speciesUuid = ?');
			await statement2.executeAsync([score, selectedSpecies.speciesUuid]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}
		setSelectedSpecies(false)
		setRetRun(false)
		setIndBulk(false)
		setIndNum(false)
		setOptionalBulk(false)
		setBulkType(false)
		setBulkNum(false)
		setIsAccurateInd(false)
		setIsAccurateBulk(false)
		setShowMap(false)
		setCharList(false)
		setIndLength(false)
		setIndWeight(false)
		fetchGear()
		fetchSpecies()
	}


	const handleDeleteClick = (deleteType: any) => {
		if (deleteType == "location") {
			setfishLocation({ latitude: 0, longitude: 0 })
			setCatchTime(false)
			setHasLocation(false)
		} else if (deleteType == "gearType") {
			setGearType(false)
		} else if (deleteType == "gear") {
			setGear(false)
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
			setIsAccurateInd(false)
			setIsAccurateBulk(false)
			setCharList(false)
			setIndLength(false)
			setIndWeight(false)
		} else if (deleteType == "all") {
			setfishLocation({ latitude: 0, longitude: 0 })
			setHasLocation(false)
			setCatchTime(false)
			setGearType(false)
			setGear(false)
			setSelectedSpecies(false)
			setRetRun(false)
			setIndBulk(false)
			setOptionalBulk(false)
			setBulkType(false)
			setIndNum(false)
			setBulkNum(false)
			setShowMap(false)
			setIsAccurateInd(false)
			setIsAccurateBulk(false)
			setCharList(false)
			setIndLength(false)
			setIndWeight(false)
		} 
	}

	return (
		<ParallaxScrollView
		headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
		headerImage={
			<Image
			source={require('@/assets/images/pitcairn_001_transparent.png')}
			style={styles.reactLogo}/>
		}>
			<ThemedView>
			{(!hasLocation && !showMap) && (
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
							<MapLibreGL.Camera centerCoordinate={[-130.10078317328868, -25.066344018762607]} zoomLevel={10} />
						</MapLibreGL.MapView>
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
					{(fishLocation ) && (
						<ThemedText type="defaultSemiBold"> Latitude: {fishLocation.latitude} Longitude:{fishLocation.longitude}  </ThemedText>
					)}
					{catchTime && (
						<ThemedText type="defaultSemiBold"> Time: {catchTime.toLocaleString()} </ThemedText>
					)}
					{(fishLocation && catchTime) && (
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
			{(hasLocation && !gearType) && (
				<ThemedView>
					<ThemedView style={{flexDirection: 'column', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
						<Pressable onPress={() => { setGearType("rod"); }} style={({ pressed }) => [{width: 150,height: 150},]}>
							<Image source={require('@/assets/images/rod_line_transparent.png')} style={{ width: 150, height: 150 }} />
						</Pressable>
						<Pressable onPress={() => { setGearType("longline") }} style={({ pressed }) => [{width: 150,height: 150},]}>
							<Image source={require('@/assets/images/longline_transparent.png')} style={{ width: 150, height: 150 }} />
						</Pressable>
						<Pressable onPress={() => { setGearType("net"); }} style={({ pressed }) => [{width: 150,height: 150},]}>
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
			{(gearType && !gear) && (
				<ThemedView>
					<ThemedText type="defaultSemiBold"> Gear Select: </ThemedText>
					<Picker
						style={{ color: textColor[colorScheme] }}
						mode="dropdown"
						dropdownIconColor={textColor[colorScheme]}
						selectedValue={gear}
						onValueChange={(itemValue, itemIndex) => setGear(itemValue)}>
							<Picker.Item label="Gear " value="Gear" />
							{gearList.filter((gear: any) => gear.type == gearType).map((gear: any) => {
								return (
									<Picker.Item key={gear.gearUuid} label={gear.name} value={gear} />
								);
							})}
						</Picker>
					<ThemedView style={{ marginTop: 240, marginBottom: 20 }}>
						<Button
							title="Reselect Gear Type"
							color="#ff0000"
							onPress={() => handleDeleteClick("gearType")}
						/>
					</ThemedView>
				</ThemedView>		
				)}
			{(gear && !selectedSpecies) && (
				<ThemedView>
					<ThemedText type="defaultSemiBold"> Species Select: </ThemedText>
					<Picker
						style={{ color: textColor[colorScheme]}}
						mode="dropdown"
						dropdownIconColor={textColor[colorScheme]}
						selectedValue={selectedSpecies}
						onValueChange={(itemValue, itemIndex) => setSelectedSpecies(itemValue)}
						>
						<Picker.Item key={"Species"} label={"Species"} value={"Species"} />
						{speciesList.map((memSpecies: any) => {
								return (
									<Picker.Item key={memSpecies.speciesUuid} label={memSpecies.islandName} value={memSpecies} />
								);
							})}
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
						onValueChange={(itemValue, itemIndex) => setRetRun(itemValue)}
					>
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
						onValueChange={(itemValue, itemIndex) => setIndBulk(itemValue)}
					>
						<Picker.Item label="Individual/Bulk" value="Ind/Bulk" />
						<Picker.Item label="Individual" value="Individual" />
						<Picker.Item label="Bulk" value="Bulk" />
					</Picker>
				{(indBulk == "Individual") && (
					<ThemedView>
						<ThemedView style={{ flexDirection: 'row', marginTop: 30 }}>
							<ThemedView>
								<ThemedText type="defaultSemiBold"> Number: </ThemedText>
								<TextInput keyboardType='numeric' value={indNum} style={{ color: textColor[colorScheme] }} placeholder="Number" placeholderTextColor={textColor[colorScheme]} onChangeText={handleIndividualChange} />
							</ThemedView> 
							<ThemedView style={{ marginLeft: 100 }}>
								<ThemedText type="defaultSemiBold">Accurate: </ThemedText>
								<Switch
									trackColor={{ false: '#767577', true: '#81b0ff' }}
									thumbColor={isAccurateInd ? '#f5dd4b' : '#f4f3f4'}
									onValueChange={toggleSwitchInd}
									value={isAccurateInd}
								/>
							</ThemedView>
						</ThemedView> 
						{(indNum) && (
							<ThemedView style={{ marginTop: 40, borderColor: '1px solid rgba(1, 0, 0, 1)', borderWidth:1 }} >
								<ThemedText type="defaultSemiBold"> Optional Individual Characteristics: </ThemedText>
								<ThemedView style={{ flexDirection: 'row', marginLeft: 10, marginTop: 20, justifyContent: "flex-start" , alignItems: 'center' }} >
									<ThemedView >
										<ThemedText type="defaultSemiBold"> length: </ThemedText>
										<TextInput keyboardType='numeric' value={indLength} style={{ color: textColor[colorScheme] }} placeholder="length" placeholderTextColor={textColor[colorScheme]} onChangeText={handleIndLengthChange} />
									</ThemedView>
									<ThemedView style={{ marginLeft: 80 }} >
										<ThemedText type="defaultSemiBold"> Weight: </ThemedText>
										<TextInput keyboardType='numeric' value={indWeight} style={{ color: textColor[colorScheme] }} placeholder="weight" placeholderTextColor={textColor[colorScheme]} onChangeText={handleIndWeightChange} />
									</ThemedView>
								</ThemedView>
								<ThemedView style={{ flexDirection: 'row', marginLeft: 10, marginTop: 20, marginBottom: 5, justifyContent: "flex-start", alignItems: 'center' }}>
									<Button
										title="Add length"
										color="#008000"
										onPress={() => handleAddLength()}
									/>
									<ThemedView style={{ marginLeft: 80 }}>
										<Button
											title="Remove length"
											color="#ff0000"
											onPress={() => handleDeleteLength()}
										/>
									</ThemedView>
								</ThemedView>
							</ThemedView> 
						)}
						{(!optionalBulk) && (
							<ThemedView style={{ marginTop: 40, marginBottom: 10 }}>
								<Button
									title="Add Bulk Quantity"
									color="#008000"
									onPress={() => setOptionalBulk(true)}
								/>
							</ThemedView>
						)}
						{(optionalBulk) && (
							<ThemedView style={{ marginTop: 30 }} >
								<ThemedText type="defaultSemiBold"> Bulk Select: </ThemedText>
								<Picker
									style={{ color: textColor[colorScheme] }}
									mode="dropdown"
									dropdownIconColor={textColor[colorScheme]}
									selectedValue={bulkType}
									onValueChange={(itemValue, itemIndex) => setBulkType(itemValue)}
								>
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
											thumbColor={isAccurateBulk ? '#f5dd4b' : '#f4f3f4'}
											onValueChange={toggleSwitchBulk}
											value={isAccurateBulk}
										/>
									</ThemedView>
								</ThemedView>
							</ThemedView>
						)}
						<ThemedView style={{ flexDirection: 'row', marginTop: 40, justifyContent: "flex-start", alignItems: 'center' }}>
							<ThemedView>
								<ThemedText type="defaultSemiBold">Personal: </ThemedText>
								<Switch
									trackColor={{ false: '#767577', true: '#81b0ff' }}
									thumbColor={isPersonal ? '#f5dd4b' : '#f4f3f4'}
									onValueChange={handlePersonalChange}
									value={isPersonal}
								/>
							</ThemedView>
							<ThemedView style={{  marginLeft: 80  }}>
								<ThemedText type="defaultSemiBold">Verified on Ship: </ThemedText>
									<Switch
										trackColor={{ false: '#767577', true: '#81b0ff' }}
										thumbColor={isPersonal ? '#f5dd4b' : '#f4f3f4'}
										onValueChange={handleVerifiedChange}
										value={isVerified}
								/>
							</ThemedView>	
						</ThemedView>
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
						onValueChange={(itemValue, itemIndex) => setBulkType(itemValue)}
					>
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
								thumbColor={isAccurateBulk ? '#f5dd4b' : '#f4f3f4'}
								onValueChange={toggleSwitchBulk}
								value={isAccurateBulk}
							/>
						</ThemedView>
					</ThemedView>
					<ThemedView style={{ flexDirection: 'row', marginTop: 40, justifyContent: "flex-start", alignItems: 'center' }}>
						<ThemedView>
							<ThemedText type="defaultSemiBold">Personal: </ThemedText>
							<Switch
								trackColor={{ false: '#767577', true: '#81b0ff' }}
								thumbColor={isPersonal ? '#f5dd4b' : '#f4f3f4'}
								onValueChange={handlePersonalChange}
								value={isPersonal}
							/>
						</ThemedView>
						<ThemedView style={{ marginLeft: 80 }}>
							<ThemedText type="defaultSemiBold">Verified on Ship: </ThemedText>
							<Switch
								trackColor={{ false: '#767577', true: '#81b0ff' }}
								thumbColor={isPersonal ? '#f5dd4b' : '#f4f3f4'}
								onValueChange={handleVerifiedChange}
								value={isVerified}
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
				
			{(fishLocation && hasLocation && !showMap) ? (<ThemedText type="defaultSemiBold"> Latitude: {fishLocation.latitude} Longitude:{fishLocation.longitude}</ThemedText>): null}
			{(catchTime && !showMap) ? (<ThemedText type="defaultSemiBold"> Time: {catchTime.toLocaleString()} </ThemedText>):null}
			{gearType ? (<ThemedText type="defaultSemiBold"> Gear: {gearType} </ThemedText>):null}
			{gear ? (<ThemedText type="defaultSemiBold"> Gear: {gear.name} </ThemedText>):null}
			{selectedSpecies ? (<ThemedText type="defaultSemiBold"> Species: {selectedSpecies.islandName} </ThemedText>):null}
			{(retRun) ? (<ThemedText type="defaultSemiBold"> Retained/Returned: {retRun} </ThemedText>):null}
			{(indNum && !bulkNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} </ThemedText>):null}
			{(bulkType) ? (<ThemedText type="defaultSemiBold"> Bulk Type: {bulkType} </ThemedText>):null}
			{(bulkNum && !indNum) ? (<ThemedText type="defaultSemiBold"> Bulk Number: {bulkNum} </ThemedText>):null}
			{(bulkNum && indNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} Bulk Number: {bulkNum} </ThemedText>) : null}
				{(charList) && <ThemedView style={{ flexDirection: 'column' }}>
					<ThemedText type="defaultSemiBold"> Individual Characteristics: </ThemedText >
					{charList.map((ind: any) => {
						return (
							<ThemedText type = "defaultSemiBold" style ={{ marginLeft: 10}}> 	Length:{ind.len} Weight:{ind.weight} </ThemedText >
						);
					})}
					</ThemedView>
					}
			{(indBulk == "Individual" && ((!optionalBulk && isAccurateInd) || (optionalBulk && (isAccurateInd && isAccurateBulk))) && indNum) || (indBulk == "Bulk" && isAccurateBulk && bulkNum) ? (<ThemedText type="defaultSemiBold"> Accurate </ThemedText>) : null}
			{(indBulk == "Individual" && ((!optionalBulk && !isAccurateInd) || (optionalBulk && (!isAccurateInd || !isAccurateBulk))) && indNum) || (indBulk == "Bulk" && !isAccurateBulk && bulkNum) ? (<ThemedText type="defaultSemiBold"> Estimated </ThemedText>):null}
			{(indBulk && isPersonal) ? (<ThemedText type="defaultSemiBold"> Personal </ThemedText>):null}
			{(indBulk && !isPersonal) ? (<ThemedText type="defaultSemiBold">Commerical </ThemedText>):null}
			{(indNum || bulkNum) ? (
				<ThemedView style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
					<Button
						title="Add Species"
						color="#008000"
							onPress={() => handleStoreData(fishLocation, catchTime, gear.gearUuid, selectedSpecies, retRun, bulkType, indNum, charList, bulkNum, isAccurateInd, isAccurateBulk, isPersonal, isVerified)}
					/>
					<ThemedView style={{ marginLeft: 40 }}>
						<Button
							title="Add Another Species"
							color="#008000"
								onPress={() => handleStoreDataAdditional(fishLocation, catchTime, gear.gearUuid, selectedSpecies, retRun, bulkType, indNum, charList, bulkNum, isAccurateInd, isAccurateBulk, isPersonal, isVerified)}
						/>
					</ThemedView>
				</ThemedView>):null}
			{(gearType) ? (
				<ThemedView style={{ marginTop: 40 }}>
					<Button
						title="Back to Start"
						color="#ff0000"
						onPress={() => handleDeleteClick("all")}
					/>
				</ThemedView>):null}
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
