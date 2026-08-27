import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Filtragem from "./Filtragem";
import InserirNovaFonte from "./InserirNovaFonte";
import ExibirNoticia from "./ExibirNoticias";

const API = "http://localhost:3451";

export default function ExibirUI({ escuro }) {
    const [noticias, setNoticias] = useState([]);
    const [fonte, setFonte] = useState("");
    const [categoria, setCategoria] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        fetch(`${API}/api/noticias`)
            .then((resposta) => resposta.json())
            .then((dados) => setNoticias(Array.isArray(dados) ? dados : []))
            .catch(() => setMensagem("Não foi possível carregar as notícias."));
    }, []);

    const fontes = [...new Set(noticias.map((noticia) => noticia.fonte).filter(Boolean))];
    const categorias = [...new Set(noticias.flatMap((noticia) => (noticia.categorias || "").split(",").map((item) => item.trim()).filter(Boolean)))];
    const noticiasVisiveis = noticias.filter((noticia) => {
        const categoriasDaNoticia = (noticia.categorias || "").split(",").map((item) => item.trim());
        return (!fonte || noticia.fonte === fonte) && (!categoria || categoriasDaNoticia.includes(categoria));
    });

    async function cadastrar(link) {
        setCarregando(true);
        setMensagem("");
        try {
            const resposta = await fetch(`${API}/api/fontes/cadastrar?link=${encodeURIComponent(link)}`);
            const resultado = await resposta.json();
            if (!resposta.ok) throw new Error(resultado.error || resultado.erro || "Não foi possível cadastrar a fonte.");
            setNoticias((atuais) => [...atuais, ...(resultado.noticias || []).filter((nova) => !atuais.some((atual) => atual.link === nova.link))]);
            setMensagem("Fonte adicionada com sucesso.");
            return true;
        } catch (erro) {
            setMensagem(erro.message);
            return false;
        } finally { setCarregando(false); }
    }

    async function excluir(id) {
        const resposta = await fetch(`${API}/api/noticias/deletar/noticia/${id}`, { method: "DELETE" });
        if (resposta.ok) setNoticias((atuais) => atuais.filter((noticia) => noticia.id !== id));
    }

    return (
        <View style={[styles.container, escuro && styles.containerEscuro]}>
            <Text style={[styles.titulo, escuro && styles.textoClaro]}>Agregador de notícias</Text>
            <Text style={[styles.subtitulo, escuro && styles.textoClaro]}>Acompanhe suas fontes em um só lugar.</Text>
            <InserirNovaFonte onCadastrar={cadastrar} carregando={carregando} escuro={escuro} />
            <Filtragem fontes={fontes} categorias={categorias} fonteSelecionada={fonte} categoriaSelecionada={categoria} onFonteChange={setFonte} onCategoriaChange={setCategoria} escuro={escuro} />
            {mensagem ? <Text style={[styles.mensagem, escuro && styles.textoClaro]}>{mensagem}</Text> : null}
            <ExibirNoticia noticias={noticiasVisiveis} onExcluir={excluir} escuro={escuro} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", maxWidth: 920, padding: 24 },
    containerEscuro: { backgroundColor: "#101b2d", borderRadius: 8 },
    titulo: { color: "#17324d", fontSize: 28, fontWeight: "800", marginBottom: 4 },
    subtitulo: { color: "#5f7785", marginBottom: 24 },
    mensagem: { color: "#176b87", marginBottom: 12 },
    textoClaro: { color: "#eef4ff" },
});