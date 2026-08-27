import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function InserirNovaFonte({ onCadastrar, carregando, escuro }) {
    const [link, setLink] = useState("");

    async function enviar(evento) {
        evento?.preventDefault?.();
        const sucesso = await onCadastrar(link);
        if (sucesso) setLink("");
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.label, escuro && styles.textoClaro]}>Adicionar fonte RSS</Text>
            <View style={styles.linha}>
                <TextInput
                    value={link}
                    onChangeText={setLink}
                    onSubmitEditing={enviar}
                    placeholder="https://exemplo.com/feed.xml"
                    placeholderTextColor="#78909c"
                    autoCapitalize="none"
                    keyboardType="url"
                    style={[styles.input, escuro && styles.inputEscuro]}
                />
                <Pressable onPress={enviar} disabled={carregando || !link.trim()} style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado, (carregando || !link.trim()) && styles.botaoDesabilitado]}>
                    <Text style={styles.textoBotao}>{carregando ? "Adicionando..." : "Adicionar"}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", marginBottom: 22 },
    label: { color: "#17324d", fontSize: 16, fontWeight: "700", marginBottom: 8 },
    linha: { flexDirection: "row", gap: 8, alignItems: "center" },
    input: { flex: 1, minWidth: 0, backgroundColor: "#fff", borderWidth: 1, borderColor: "#b4c8d4", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 11, color: "#17324d" },
    botao: { backgroundColor: "#176b87", borderRadius: 6, paddingHorizontal: 15, paddingVertical: 12 },
    botaoPressionado: { backgroundColor: "#0f5269" },
    botaoDesabilitado: { opacity: 0.5 },
    textoBotao: { color: "#fff", fontWeight: "700" },
    inputEscuro: { backgroundColor: "#182942", borderColor: "#38516d", color: "#eef4ff" },
    textoClaro: { color: "#eef4ff" },
});

