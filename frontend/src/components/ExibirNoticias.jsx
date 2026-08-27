import { Text, View, Pressable, StyleSheet } from "react-native";

export default function ExibirNoticia({ noticias, onExcluir, escuro }) {
  if (!noticias.length) return <View style={[styles.vazio, escuro && styles.vazioEscuro]}><Text style={[styles.vazioTexto, escuro && styles.textoClaro]}>Nenhuma notícia encontrada.</Text></View>;
  return (
    <View style={[styles.tabela, escuro && styles.tabelaEscura]}>
      <View style={[styles.linha, styles.cabecalho]}><Text style={[styles.celula, styles.tituloColuna]}>Notícia</Text><Text style={[styles.celula, styles.tituloColuna]}>Fonte</Text><Text style={[styles.celula, styles.tituloColuna]}>Categoria</Text><Text style={styles.acaoColuna}> </Text></View>
      {noticias.map((noticia) => (
        <View key={noticia.id || noticia.link} style={[styles.linha, escuro && styles.linhaEscura]}>
          <View style={styles.celula}><Text style={[styles.titulo, escuro && styles.textoClaro]}>{noticia.titulo}</Text><Text style={[styles.descricao, escuro && styles.textoClaro]}>{noticia.descricao || "Sem descrição"}</Text><Text style={styles.data}>{noticia.dataDePublicacao || ""}</Text></View>
          <Text style={[styles.celula, escuro && styles.textoClaro]}>{noticia.fonte}</Text>
          <Text style={[styles.celula, escuro && styles.destaque]}>{(noticia.categorias || "").replaceAll(",", ", ") || "Sem categoria"}</Text>
          <Pressable onPress={() => onExcluir(noticia.id)} style={styles.excluir}><Text style={styles.excluirTexto}>Excluir</Text></Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabela: { width: "100%", backgroundColor: "#fff", borderRadius: 6, overflow: "hidden", borderWidth: 1, borderColor: "#d4e0e5" },
  linha: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e4ecef", padding: 12, gap: 8 },
  cabecalho: { backgroundColor: "#eaf3f6" },
  celula: { flex: 1, minWidth: 0, color: "#365469", fontSize: 13 },
  tituloColuna: { color: "#17324d", fontWeight: "700", fontSize: 12 },
  titulo: { color: "#17324d", fontWeight: "700", marginBottom: 3 },
  descricao: { color: "#5f7785", fontSize: 12 },
  data: { color: "#8a9ca5", fontSize: 11, marginTop: 5 },
  acaoColuna: { width: 52 },
  excluir: { width: 52, alignItems: "center" },
  excluirTexto: { color: "#b34242", fontSize: 12, fontWeight: "700" },
  vazio: { width: "100%", padding: 35, alignItems: "center", backgroundColor: "#fff", borderRadius: 6 },
  vazioTexto: { color: "#5f7785" },
  tabelaEscura: { backgroundColor: "#182942", borderColor: "#38516d" },
  linhaEscura: { borderBottomColor: "#38516d" },
  vazioEscuro: { backgroundColor: "#182942" },
  textoClaro: { color: "#eef4ff" },
  destaque: { color: "#f4c400" },
});
