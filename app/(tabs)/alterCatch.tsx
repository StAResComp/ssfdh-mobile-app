import { Image, StyleSheet, Button, TextInput, useColorScheme, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import uuid from 'react-native-uuid';

export default function HomeScreen() {
	const [catchList, setCatchList] = useState<any>();
	const [currCatch, setCurrCatch] = useState<any>();
	const [verifiedCatches, setVerifiedCatches] = useState<any>();
	const [catchInfo, setCatchInfo] = useState<boolean>(false);
	const [indNum, setIndNum] = useState<any>();
	const [bulkNum, setBulkNum] = useState<any>();
	const [bulkType, setBulkType] = useState<any>();
	const [isAccurateInd, setIsAccurateInd] = useState<boolean>(false);
	const [isAccurateBulk, setIsAccurateBulk] = useState<boolean>(false);
	const db = useSQLiteContext();
	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';

	useEffect(() => {
		fetchCatch()
		
	}, []);
	//console.log(verifiedCatches)
	const toggleSwitchInd = () => setIsAccurateInd(previousState => !previousState);

	const toggleSwitchBulk = () => setIsAccurateBulk(previousState => !previousState);

	const fetchCatch= async () => {
		const data = await db.getAllAsync('SELECT * FROM catch WHERE shoreVer = 0');
		setCatchList(data);
	}

	const handleAddCatch = async () => {
		if (verifiedCatches) {
			setVerifiedCatches([...verifiedCatches, { catchUuid: currCatch }])
		} else {
			setVerifiedCatches([{ catchUuid: currCatch }] )
		}
		setCurrCatch(false)
	}

	const handleDeleteCatch = () => {
		if (verifiedCatches && verifiedCatches.length > 1 ) {
			let tempCatchList = verifiedCatches;
			tempCatchList.pop();
			setVerifiedCatches([tempCatchList])
		} else if (verifiedCatches && verifiedCatches.length == 1) {
			setVerifiedCatches(false)
		}
	}

	const handleBack = () => {
		setVerifiedCatches(false)
		setCatchInfo(false)
	}

	async function listLoop(item: any, index: any) {
		for (var key in item) {
			try {
				const statement = await db.prepareAsync('UPDATE catch SET shoreVer = 1 WHERE catchUuid = ?');
				await statement.executeAsync([item[key]])
			} catch (error) {
				console.log('Error while adding catch : ', error);

			}
		}
	}

	async function handleAddDB(bulkType: any, indNum: any, bulkNum: any, isAccurateInd: any, isAccurateBulk: any, verifiedCatches:any) { 
		let verUUID = uuid.v4()
		let verTime = new Date()
		verifiedCatches.forEach(listLoop);
	}

	const handleIndividualChange = (text: any) => {
		setIndNum(text)
	}
	const handleBulkChange = (text: any) => {
		setBulkNum(text)
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
				<ThemedText> On Shore Verification</ThemedText>
				{(!catchInfo ) && 
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
								<Picker.Item label="N/A" value= "0" />
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
						<ThemedView style={{ marginTop: 20, marginBottom: 20 }}>
							<Button
								title="Pick Catches"
								color="#008000"
								onPress={() => setCatchInfo(true)}
							/>
					</ThemedView>
					</ThemedView>
				}
				{catchInfo &&
					<ThemedView >
						<ThemedView style={{ marginTop: 20, marginBottom: 20 }} >
						<Button
							title="Fetch Catch"
							color="#008000"
							onPress={() => fetchCatch()}
							/>
						</ThemedView>
					{catchList &&
						<Picker
							style={{ color: textColor[colorScheme] }}
							mode="dropdown"
							dropdownIconColor={textColor[colorScheme]}
							selectedValue={currCatch}
							onValueChange={(itemValue, itemIndex) => setCurrCatch(itemValue)}>
							{catchList.map((memCatch: any) => {
								return (
									<Picker.Item key={memCatch.catchUuid} label={`${new Date(memCatch.date)}`} value={memCatch.catchUuid} />
									);
							})}
						</Picker>
					}
					{(catchList && currCatch) &&
						catchList.filter((memCatch: any) => memCatch.catchUuid == currCatch).map((memCatch: any) => {
							return (
								<ThemedView >
									<ThemedText> date: {`${new Date(memCatch.date)}`} </ThemedText >
									<ThemedText> latitude:  {memCatch.longitude} </ThemedText>
									<ThemedText> longitude {memCatch.latitude} </ThemedText >
									<ThemedText> Individuals:  {memCatch.indNum}</ThemedText >
									<ThemedText> Bulk Type:  {memCatch.bulkType} Bulk Number:{memCatch.bulkNum} </ThemedText >
									<ThemedView style={{ marginTop: 80 }}>
										<Button
											title="add catch to verification"
											color="#008000"
											onPress={() => handleAddCatch()}
										/>
									</ThemedView>
								</ThemedView>
								);
							})
						}
						{(indNum && !bulkNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} </ThemedText>) : null}
						{(bulkType) ? (<ThemedText type="defaultSemiBold"> Bulk Type: {bulkType} </ThemedText>) : null}
						{(bulkNum && !indNum) ? (<ThemedText type="defaultSemiBold"> Bulk Number: {bulkNum} </ThemedText>) : null}
						{(bulkNum && indNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} Bulk Number: {bulkNum} </ThemedText>) : null}
						{verifiedCatches && 
							<ThemedView>
								<ThemedText type="defaultSemiBold"> Verify Catches</ThemedText>
								{verifiedCatches.map((verCatch: any) => {
									return (
										<ThemedText key={verCatch.catchUuid}> Id: {verCatch.catchUuid} </ThemedText >
									);
								})}
							</ThemedView>
						}	
						{verifiedCatches && <ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Undo last catch"
								color="#ff0000"
								onPress={() => handleDeleteCatch()}
							/>
						</ThemedView>}
						<ThemedView style={{ marginTop: 60 }}>
							<Button
								title="Back to info entry"
								color="#ff0000"
								onPress={() => handleBack()}
							/>
						</ThemedView>

						<ThemedView style={{ marginTop: 80 }}>
							<Button
								title="Add to DB"
								color="#ff0000"
								onPress={() => handleAddDB(bulkType, indNum, bulkNum, isAccurateInd, isAccurateBulk, verifiedCatches)}
							/>
						</ThemedView>
					</ThemedView>
				}
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
