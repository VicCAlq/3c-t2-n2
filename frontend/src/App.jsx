import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ExibirNoticia from './components/ExibirNoticias';
import ExibirUI from "./components/ExibirUI";

export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <ScrollView style={styles.scroll}  
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        >
          <ExibirUI/>
          <ExibirNoticia/>
        </ScrollView>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6AACB8',
    justifyContent:"center",
    alignItems:"center"
  },
  scroll: {
  width: 500,
  height: "90vh",
  backgroundColor: '#ffffff38'
  },
  scrollContent: {
  alignItems: 'center',
  padding: 20,
  },
});
