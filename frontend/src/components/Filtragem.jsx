import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

function MenuFiltro({ titulo, opcoes, valor, onChange, escuro }) {
    const [aberto, setAberto] = useState(false);
    return (
        <View style={styles.menu}>
            <Pressable onPress={() => setAberto(!aberto)} style={[styles.seletor, escuro && styles.seletorEscuro]}>
                <Text style={[styles.seletorTexto, escuro && styles.textoClaro]}>{valor || titulo}</Text>
                <Text style={styles.seta}>{aberto ? "▲" : "▼"}</Text>
            </Pressable>
            {aberto && <View style={[styles.opcoes, escuro && styles.opcoesEscuro]}>
                {opcoes.map((opcao) => (
                    <Pressable key={opcao.valor} onPress={() => { onChange(opcao.valor); setAberto(false); }} style={styles.opcao}>
                        <Text style={[styles.opcaoTexto, escuro && styles.textoClaro]}>{opcao.label}</Text>
                    </Pressable>
                ))}
            </View>}
        </View>
    );
}

export default function Filtragem({ fontes, categorias, fonteSelecionada, categoriaSelecionada, onFonteChange, onCategoriaChange, escuro }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.titulo, escuro && styles.textoClaro]}>Filtrar notícias</Text>
            <View style={styles.menus}>
                <MenuFiltro titulo="Todas as fontes" valor={fonteSelecionada} opcoes={[{ label: "Todas as fontes", valor: "" }, ...fontes.map((fonte) => ({ label: fonte, valor: fonte }))]} onChange={onFonteChange} escuro={escuro} />
                <MenuFiltro titulo="Todas as categorias" valor={categoriaSelecionada} opcoes={[{ label: "Todas as categorias", valor: "" }, ...categorias.map((categoria) => ({ label: categoria, valor: categoria }))]} onChange={onCategoriaChange} escuro={escuro} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", marginBottom: 18, zIndex: 10 },
    titulo: { color: "#17324d", fontSize: 16, fontWeight: "700", marginBottom: 8 },
    menus: { flexDirection: "row", gap: 10, zIndex: 10 },
    menu: { flex: 1, position: "relative", zIndex: 11 },
    seletor: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#b4c8d4", borderRadius: 6, padding: 11, flexDirection: "row", justifyContent: "space-between" },
    seletorTexto: { color: "#294b61", flexShrink: 1 },
    seta: { color: "#176b87", marginLeft: 6 },
    opcoes: { position: "absolute", top: 45, left: 0, right: 0, backgroundColor: "#fff", borderWidth: 1, borderColor: "#b4c8d4", borderRadius: 6, zIndex: 99, elevation: 8 },
    opcao: { padding: 11, borderBottomWidth: 1, borderBottomColor: "#edf2f4" },
    opcaoTexto: { color: "#294b61" },
    seletorEscuro: { backgroundColor: "#182942", borderColor: "#38516d" },
    opcoesEscuro: { backgroundColor: "#182942", borderColor: "#38516d" },
    textoClaro: { color: "#eef4ff" },
});