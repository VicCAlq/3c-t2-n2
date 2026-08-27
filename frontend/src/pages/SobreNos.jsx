import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import Cabecario from "../components/Cabecario";

const integrantes = [
  { personagem: "Noturno", nome: "Elyson França", imagem: require("../../assets/membros/noturno.jpg") },
  { personagem: "Lince Negra", nome: "Samara Pessoa", imagem: require("../../assets/membros/lince-negra.jpg") },
  { personagem: "Fera", nome: "Lucas Carson", imagem: require("../../assets/membros/fera.jpg") },
  { personagem: "Xavier", nome: "João Pedro", imagem: require("../../assets/membros/xavier.jpg") },
];

export default function SobreNos({ onNavigate, escuro, onToggleTema }) {
  return (
    <View style={[styles.tela, escuro && styles.telaEscura]}>
      <Cabecario onNavigate={onNavigate} escuro={escuro} onToggleTema={onToggleTema} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={[styles.painel, escuro && styles.painelEscuro]}>
          <Text style={[styles.titulo, escuro && styles.textoClaro]}>Sobre nós</Text>
          <Text style={[styles.texto, escuro && styles.textoClaro]}>
            O Agregador de notícias reúne publicações de diferentes fontes em um só lugar.
          </Text>
          <Text style={[styles.texto, escuro && styles.textoClaro]}>
            Adicione um feed RSS, acompanhe as notícias e use os filtros para encontrar o que procura.
          </Text>
          <View style={styles.grade}>
            {integrantes.map((integrante) => (
              <View key={integrante.nome} style={styles.card}>
                <Image source={integrante.imagem} style={styles.imagem} />
                <Text style={[styles.personagem, escuro && styles.destaqueEscuro]}>{integrante.personagem}</Text>
                <Text style={[styles.nome, escuro && styles.textoClaro]}>{integrante.nome}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#8ac5e9" },
  telaEscura: { backgroundColor: "#0a1424" },
  conteudo: { alignItems: "center", paddingVertical: 24 },
  painel: { width: "92%", maxWidth: 920, backgroundColor: "#aad6f1", borderRadius: 8, padding: 28 },
  painelEscuro: { backgroundColor: "#111d32" },
  titulo: { color: "#17324d", fontSize: 28, fontWeight: "800", marginBottom: 16 },
  texto: { color: "#365469", fontSize: 16, lineHeight: 24, marginBottom: 12 },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 10 },
  card: { flexGrow: 1, flexBasis: 180, backgroundColor: "#f7fbfc", borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#cbdde4", paddingBottom: 14 },
  imagem: { width: "100%", height: 210, resizeMode: "cover" },
  personagem: { color: "#176b87", fontSize: 17, fontWeight: "800", marginTop: 12, marginHorizontal: 14 },
  nome: { color: "#365469", fontSize: 14, marginTop: 4, marginHorizontal: 14 },
  textoClaro: { color: "#eef4ff" },
  destaqueEscuro: { color: "#f4c400" },
});
