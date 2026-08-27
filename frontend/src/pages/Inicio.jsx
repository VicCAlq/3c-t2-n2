import { StyleSheet, View, ScrollView } from 'react-native';
import ExibirUI from "../components/ExibirUI";
import Cabecario from '../components/Cabecario';
 
 
 export default function Inicio({ onNavigate, escuro, onToggleTema }) {
  return (
 <View>
        <Cabecario onNavigate={onNavigate} escuro={escuro} onToggleTema={onToggleTema}></Cabecario>
      
    <View style={[styles.container, escuro && styles.containerEscuro]}>
      <View>
        <ScrollView style={[styles.scroll, escuro && styles.scrollEscuro]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        > 
        
          <ExibirUI escuro={escuro} />
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
  containerEscuro: { backgroundColor: '#0a1424' },
  scroll: {
  width: 500,
  height: "100vh",
  backgroundColor: '#aad6f1',
  borderRadius: '15px',
  padding:"20px"
  
  },
  scrollEscuro: { backgroundColor: '#101b2d' },
  scrollContent: {
  alignItems: 'center',
  padding: 20,
 
  },
  gradiente: {
     width: 500,
    height: '100vh',

  }
  });