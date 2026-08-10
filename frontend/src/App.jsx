import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import InserirNovaFonte from './components/InserirNovaFonte';
import ExibirNoticia from './components/ExibirNoticias';
import MenusFiltro from './components/Menus';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <InserirNovaFonte />
        <ExibirNoticia />
        <MenusFiltro />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(106, 172, 184, 1)",
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
  },
  title: {
    color: "#101015"
  }
});
