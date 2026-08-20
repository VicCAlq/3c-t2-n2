import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ExibirNoticia from '../components/ExibirNoticias';
import ExibirUI from "../components/ExibirUI";
import Cabecario from '../components/Cabecario';
import { LinearGradient } from 'expo-linear-gradient'; 
 
 
 export default function Inicio() {
  return (
 <View>
        <Cabecario></Cabecario>
      
    <View style={styles.container}>
      <LinearGradient
    colors={['#8ac5e9', '#8999cc', '#686f92']}
    style={StyleSheet.absoluteFillObject}></LinearGradient>
      
      
      <View>
        <ScrollView style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        > 
        
          <ExibirNoticia/>         
        </ScrollView>
      </View>
    </View>
   </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:"100vh",
    backgroundColor: '#8ac5e9',
    justifyContent:"center",
    alignItems:"center",
    position: 'relative',
    
  },
  scroll: {
  width: 500,
  height: "100vh",
  backgroundColor: '#aad6f1',
  borderRadius: '15px',
  padding:"20px"
  
  },
  scrollContent: {
  alignItems: 'center',
  padding: 20,
 
  },
  gradiente: {
     width: 500,
    height: '100vh',

  }
  });