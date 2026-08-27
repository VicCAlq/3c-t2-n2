import { StyleSheet, ScrollView, View } from "react-native";
import Cabecario from "../components/Cabecario";
import ExibirUI from "../components/ExibirUI";

export default function Noticias({ onNavigate, escuro, onToggleTema }) {
  return (
    <View style={[styles.tela, escuro && styles.telaEscura]}>
      <Cabecario onNavigate={onNavigate} escuro={escuro} onToggleTema={onToggleTema} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <ExibirUI escuro={escuro} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#8ac5e9" },
  telaEscura: { backgroundColor: "#0a1424" },
  conteudo: { alignItems: "center", paddingVertical: 24 },
});
