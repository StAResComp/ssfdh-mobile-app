import { Image, StyleSheet, Button, Pressable, TextInput, useColorScheme,Switch } from 'react-native';
import { useState,useEffect} from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import uuid from 'react-native-uuid';

export default function HomeScreen() {
	const [gearList, setGearList] = useState<any>();
	const [newGearPage, setNewGearPage] = useState<boolean>(false);
	const [deleteGearPage, setDeleteGearPage] = useState<boolean>(false);
	const [newGearType, setNewGearType] = useState<string>("");
	const [newGearName, setNewGearName] = useState<string>("");
	const [newGearNumber, setNewGearNumber] = useState<string>("");
	const [deleteGearItem, setDeleteGearItem] = useState<string>("");
	const db = useSQLiteContext();
	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';


	const fetchGear = async () => {
		const data = await db.getAllAsync('SELECT * FROM gear WHERE visible = 1');
		setGearList(data);
	}

	useEffect(() => {
		fetchGear()
	}, [newGearPage, deleteGearPage]);

	const handleNameChange = (text:any) => {
		setNewGearName(text)
	}
	const handleGearNumChange = (text:any) => {
		setNewGearNumber(text)
	}

	const handleDeleteGearPage = () => {
		setDeleteGearPage(true)
	}

	const handleDeleteGear = async (gearItem: string) => {
		
		try {

			const statement = await db.prepareAsync('UPDATE gear SET visible = 0 WHERE gearUuid = ?');
			await statement.executeAsync(gearItem);
		} catch (error) {
			console.log('Error while deletinglocations : ', error);
		}
		setDeleteGearPage(false)
	}


	const registerGear = async (gearType: any, gearName: any, gearNumber: any) => {
		let gearUID = uuid.v4()
		try {
			const statement = await db.prepareAsync('INSERT INTO gear ( gearUuid, type, name, number) VALUES (?,?,?,?)');
			await statement.executeAsync([gearUID, gearType, gearName, gearNumber]);
		} catch (error) {
			console.log('Error while adding location : ', error);
		}
		setNewGearPage(false)
	}


	const handleNewGearPage = () =>
	{
		setNewGearType("")
		setNewGearName("")
		setNewGearNumber("")
		setNewGearPage(true)
	}
	const handleBack = () => {
		setNewGearType("")
		setNewGearName("")
		setNewGearNumber("")
		setDeleteGearItem("")
		setNewGearPage(false)
		setDeleteGearPage(false)
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
				{(!newGearPage && !deleteGearPage) && (				
					<ThemedView>
						 {gearList &&<ThemedView>
							<ThemedText> Gear List</ThemedText >
							{gearList.map((gear: any) => {
								return (
									<ThemedText key={gear.gearUuid}> Name: {gear.name} Type: {gear.type} Amount: {gear.number} </ThemedText >
								);
							})}
						</ThemedView>}
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="New Gear Item"
								color="#008000"
								onPress={() => handleNewGearPage()}
							/>
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Delete Gear Item"
								color="#ff0000"
								onPress={() => handleDeleteGearPage()}
							/>
						</ThemedView>
				</ThemedView>
				)}
				{deleteGearPage && (
					<ThemedView>
						<ThemedView>
							<ThemedText type="defaultSemiBold">Gear Type Select: </ThemedText>
							<Picker
								style={{ color: textColor[colorScheme] }}
								mode="dropdown"
								dropdownIconColor={textColor[colorScheme]}
								selectedValue={deleteGearItem}
								onValueChange={(itemValue, itemIndex) =>
									setDeleteGearItem(itemValue)
								}>
								<Picker.Item label="Gear Type" value="GearType" />
								{gearList.map((gear: any) => {
									return (
										<Picker.Item label={gear.name} value={gear.gearUuid} />
									);
								})}
							</Picker>
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Delete Gear Item"
								color="#008000"
								onPress={() => handleDeleteGear(deleteGearItem)}
							/>
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Back"
								color="#ff0000"
								onPress={() => handleBack()}
							/>
						</ThemedView>
					</ThemedView>
				)}
				{newGearPage && (
					<ThemedView>
						<ThemedView>
						<ThemedText type="defaultSemiBold">Gear Type Select: </ThemedText>
							<Picker
								style={{ color: textColor[colorScheme] }}
								mode="dropdown"
								prompt= "gearType"
								dropdownIconColor={textColor[colorScheme]}
								selectedValue={newGearType}
								onValueChange={(itemValue, itemIndex) =>
									setNewGearType(itemValue)
								}>
								<Picker.Item label="Rod" value="rod" />
								<Picker.Item label="Longline" value="longline" />
								<Picker.Item label="Net" value="net" />
							</Picker>
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<ThemedText> Gear Name:</ThemedText>
							<TextInput keyboardType='default' value={newGearName} style={{ color: textColor[colorScheme] }} placeholder="Gear Name" placeholderTextColor={textColor[colorScheme]} onChangeText={handleNameChange} />
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<ThemedText> Gear Amount:</ThemedText>
							<TextInput keyboardType='numeric' value={newGearNumber} style={{ color: textColor[colorScheme] }} placeholder="Gear Number" placeholderTextColor={textColor[colorScheme]} onChangeText={handleGearNumChange} />
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Register Gear Item"
								color="#008000"
								onPress={() => registerGear(newGearType, newGearName, newGearNumber)}
							/>
						</ThemedView>
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Back"
								color="#ff0000"
								onPress={() => handleBack()}
							/>
						</ThemedView>
					</ThemedView>
				)}
			</ThemedView>
		</ParallaxScrollView>
	);
};

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
