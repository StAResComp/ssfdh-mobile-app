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
	const [verifiedGroups, setVerifiedGroups] = useState<any>();
	const [currGroup, setCurrGroup] = useState<any>();
	const [pageStyle, setPageStyle] = useState<string>("Group");
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

	const toggleSwitchInd = () => setIsAccurateInd(previousState => !previousState);

	const toggleSwitchBulk = () => setIsAccurateBulk(previousState => !previousState);

	const fetchCatch= async () => {
		const data = await db.getAllAsync('SELECT * FROM catch WHERE shoreVer = 0');
		setCatchList(data);
	}

	function removeItemVerGroup(array:any, itemToRemove:any) {
		//console.log("Before:", array);
		if (verifiedGroups.length > 1) {
			setVerifiedGroups(array.filter(item => item !== itemToRemove));
		} else if (verifiedGroups.length = 1) {
			setVerifiedGroups(false)
		}
		//console.log("After:", verifiedGroups);
	}

	function removeItemCatch(array: any, itemToRemove: any) {
		//console.log("Before:", array);
		if (catchList.length > 1) {
			setCatchList(array.filter(item => item !== itemToRemove));
		} else if (catchList.length = 1) {
			setCatchList(false)
		}
		//console.log("After:", catchList);
	}

	const handleAddVerGroup = async () => {
		if (verifiedGroups) {
			setVerifiedGroups([...verifiedGroups, currGroup])
		} else {
			setVerifiedGroups([currGroup] )
		}
		setCurrGroup(false)
	}

	const handleAddCatchGroup = async () => {
		if (currGroup) {
			setCurrGroup([...currGroup, { catchUuid: currCatch }])
		} else {
			setCurrGroup([{ catchUuid: currCatch }])
		}
		removeItemCatch(catchList, currCatch)
		setCurrCatch(false)
	}


	const handleGoToInfoPage =  () => {
			setCurrGroup(false)
			setPageStyle("Info")
		
	}

	const handleVerSubmit = () => {
		removeItemVerGroup(verifiedGroups,currGroup)
		setCurrGroup(false)
		AddVertoDB()
	}
	

	async function AddVerLinkstoDB(item:any,verifyUID:any) {
		for (var key in item) {
			try {
				console.log(item[key].catchUuid)
				const statement = await db.prepareAsync('UPDATE catch SET shoreVer = 1 WHERE catchUuid = ?');
				await statement.executeAsync([item[key].catchUuid])
				const statement2 = await db.prepareAsync('INSERT INTO verLink(verifyUuid,catchUuid)VALUES (?,?)');
				await statement2.executeAsync([verifyUID, item[key].catchUuid])
			} catch (error) {
				console.log('Error while adding catch : ', error);

			}
		}
	}

	async function AddVertoDB() {
		let verifyUID = uuid.v4()
		let dateVer = new Date()
		try {
			const statement = await db.prepareAsync('INSERT INTO catchVerify(verifyUuid,date,indNum,bulkType,bulkNum,accurateInd,accurateBulk  ) VALUES (?,?,?,?,?,?,?)');
			await statement.executeAsync([verifyUID,dateVer.toISOString(), indNum, bulkType, bulkNum, isAccurateInd, isAccurateBulk]);
		} catch (error) {
			console.log('Error while adding catch : ', error);
		}
		AddVerLinkstoDB(currGroup,verifyUID)
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
				{(pageStyle == "Group") &&
					<ThemedView>
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
								{catchList.map((memCatch: any, i:any) => {
									return (
										<Picker.Item key={memCatch.catchUuid} label={`${new Date(memCatch.date).toDateString()} ${i+1}`} value={memCatch.catchUuid} />
									);
								})}
							</Picker>
						}
						{(catchList && currCatch) &&
							catchList.filter((memCatch: any) => memCatch.catchUuid == currCatch).map((memCatch: any) => {
								return (
									<ThemedView >
										<ThemedText> date: {`${new Date(memCatch.date)}`} </ThemedText >
										<ThemedText> species:  {memCatch.species} </ThemedText>
										<ThemedText> Retained/Ruturned:  {memCatch.retRun} </ThemedText>
										<ThemedText> latitude:  {memCatch.longitude} </ThemedText>
										<ThemedText> longitude {memCatch.latitude} </ThemedText >
										<ThemedText> Individuals:  {memCatch.indNum}</ThemedText >
										<ThemedText> Bulk Type:  {memCatch.bulkType} Bulk Number:{memCatch.bulkNum} </ThemedText >
										<ThemedView style={{ marginTop: 80 }}>
											<Button
												title="Add catch to group"
												color="#008000"
												onPress={() => handleAddCatchGroup()}
											/>
										</ThemedView>
									</ThemedView>
								);
							})}
						<ThemedView style={{ marginTop: 80, marginBottom: 20 }} >
							<Button
								title="Submit Group"
								color="#008000"
								onPress={() => handleAddVerGroup()}
							/>
						</ThemedView>
						{(verifiedGroups) &&
							<ThemedView >
								{verifiedGroups.map((memGroup: any, i: any) => {
									return (
										<>
											<ThemedText> Group:{i + 1} </ThemedText >
											<ThemedText> {JSON.stringify(memGroup)} </ThemedText >
										</>
									)
								})}
							</ThemedView >
						}
						<Button
							title="Go to  Info Page"
							color="#008000"
							onPress={() => handleGoToInfoPage()}
						/>
					</ThemedView>}
				{(pageStyle=="Info") &&
					<ThemedView>
						<ThemedView style={{ marginTop: 30, marginBottom: 30 }}>
							{verifiedGroups &&
								<Picker
									style={{ color: textColor[colorScheme] }}
									mode="dropdown"
									dropdownIconColor={textColor[colorScheme]}
									selectedValue={currCatch}
									onValueChange={(itemValue, itemIndex) => setCurrGroup(itemValue)}>

									{verifiedGroups.map((memGroup: any, i: any) => {
										return (
											<Picker.Item key={i} label={`Group: ${i + 1}`} value={memGroup} />
										);
									})}
								</Picker>}
							{currGroup && 
								<>
								<ThemedText> Number of Cach Records{currGroup.length} </ThemedText >
								{currGroup.map((memGroup: any, i: any) => {
									return (
										<>
											<ThemedText> {JSON.stringify(memGroup)} </ThemedText >
										</>
									)
								})}
							</>
							}
						</ThemedView>
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
								<Picker.Item label="N/A" value="0" />
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
						<ThemedView style={{ marginTop: 20 }}>
							{(indNum && !bulkNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} </ThemedText>) : null}
							{(bulkType) ? (<ThemedText type="defaultSemiBold"> Bulk Type: {bulkType} </ThemedText>) : null}
							{(bulkNum && !indNum) ? (<ThemedText type="defaultSemiBold"> Bulk Number: {bulkNum} </ThemedText>) : null}
							{(bulkNum && indNum) ? (<ThemedText type="defaultSemiBold"> Individuals: {indNum} Bulk Number: {bulkNum} </ThemedText>) : null}
							{(isAccurateInd) ? (<ThemedText type="defaultSemiBold"> Ind Accurate: True </ThemedText>) : <ThemedText type="defaultSemiBold"> Ind Accurate: False</ThemedText>}
							{(isAccurateBulk) ? (<ThemedText type="defaultSemiBold"> Bulk Accurate: True </ThemedText>) : <ThemedText type="defaultSemiBold"> Bulk Accurate: False</ThemedText>}
						</ThemedView>
						<ThemedView style={{ marginTop: 20 }}>
							<Button
								title="Submit"
								color="#008000"
								onPress={() => handleVerSubmit()}
							/>
						</ThemedView>
						<ThemedView style={{ marginTop: 20 }}>
							<Button
								title="back"
								color="#008000"
								onPress={() => setPageStyle("Group")}
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
