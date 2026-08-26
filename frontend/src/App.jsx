import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Exemplo from './components/Exemplo';
import Pagprin from "./components/Pagprin.jsx";
import Cadastrar from "./components/Cadastrar.jsx";


export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView>
      <Pagprin/>
      <Cadastrar/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eec",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: "#101015"
  }
});
