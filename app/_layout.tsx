import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SQLiteProvider } from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	async function initializeDatabase(db: any) {
		try {
			await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS locations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				latitude REAL NOT NULL,
				longitude REAL NOT NULL,
				speed REAL NOT NULL,
				heading REAL NOT NULL,
				altitude REAL NOT NULL,
				timestamp INTEGER NOT NULL
            );`);

			await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS catch (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				catchUuid TEXT NOT NULL,
				latitude REAL NOT NULL,
				longitude REAL NOT NULL,
				date TEXT NOT NULL,
				gearUuid TEXT NOT NULL,
				species TEXT NOT NULL,
				retRun TEXT NOT NULL,
				indNum INTEGER,
				characteristics TEXT,
				bulkType TEXT,
				bulkNum REAL,
				accurateInd INTEGER NOT NULL,
				accurateBulk INTEGER NOT NULL,
				personal INTEGER NOT NULL,
				shipVer INTEGER NOT NULL,
				shoreVer INTEGER NOT NULL  DEFAULT 0,
				FOREIGN KEY (gearUuid)
					REFERENCES gear (gearUuid)
			);`);

			await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS catchVerify (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				verifyUuid TEXT NOT NULL,
				date TEXT NOT NULL,
				indNum INTEGER,
				bulkType TEXT,
				bulkNum REAL,
				accurateInd INTEGER NOT NULL,
				accurateBulk INTEGER NOT NULL,
				verifies TEXT NOT NULL
			);`);

			await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS gear (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				gearUuid TEXT NOT NULL,
				type TEXT NOT NULL,
				name TEXT NOT NULL,
				number REAL NOT NULL,
				visible INTEGER NOT NULL DEFAULT 1
			);`);
	
			console.log('Database initialised')
		} catch (error) {
			console.log('Error while initializing database : ', error);
		}
	}

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<SQLiteProvider databaseName='example.db' onInit={initializeDatabase}>
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
			</ThemeProvider>
		</SQLiteProvider>
	);
}

