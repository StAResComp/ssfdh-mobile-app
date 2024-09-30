import { Image, StyleSheet, Button, TextInput, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext } from 'expo-sqlite';


export default function HomeScreen() {
	const [catchList, setCatchList] = useState<any>();
	const [latitude, setLatitude] = useState<number>();
	const [longitude, setLongitude] = useState<number>();
	const [date, setDate] = useState<any>();
	const [species, setSpecies] = useState<string>();
	const [indNum, setIndNum] = useState<number>();
	const [bulkType, setBulkType] = useState<string>();
	const [bulkNum, setBulkNum] = useState<number>();
	const [showUpdateOptions, setShowUpdateOptions] = useState<boolean>(false);
	const db = useSQLiteContext();
	const textColor = { dark: '#ECEDEE', light: '#11181C' }
	const colorScheme = useColorScheme() ?? 'light';


	const fetchCatch= async () => {
		const data = await db.getAllAsync('SELECT * FROM catch WHERE accurateInd = 0 OR accurateBulk = 0 ');
		setCatchList(data);
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
