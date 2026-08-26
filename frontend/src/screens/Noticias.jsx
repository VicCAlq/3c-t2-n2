import { useEffect, useState } from "react";

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import Cabecario from "../components/Cabecario";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);

  const [fonteSelecionada, setFonteSelecionada] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const [fontes, setFontes] = useState([]);

  async function buscarNoticias() {
    try {
      const resposta = await fetch("http://localhost:3451/api/noticias");

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      const resultado = await resposta.json();

      setNoticias(resultado.data);
    } catch (erro) {
      console.log("Erro ao buscar notícias:", erro);
    }
  }

  async function buscarFontes() {
    try {
      const resposta = await fetch("http://localhost:3451/api/fontes");

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      const resultado = await resposta.json();

      setFontes(resultado.data);
    } catch (erro) {
      console.log("Erro ao buscar fontes:", erro);
    }
  }

  async function buscarNoticiasPorFonte(fonte) {
    try {
      const query = new URLSearchParams({
        fonte: fonte,
      });

      const resposta = await fetch(
        `http://localhost:3451/api/noticias/fonte?${query}`,
      );

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      const resultado = await resposta.json();

      setNoticias(resultado.data);
    } catch (erro) {
      console.log("Erro ao filtrar por fonte:", erro);
    }
  }

  async function buscarNoticiasPorCategoria(categoria) {
    try {
      const query = new URLSearchParams({
        categoria: categoria,
      });

      const resposta = await fetch(
        `http://localhost:3451/api/noticias/categoria?${query}`,
      );

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      const resultado = await resposta.json();

      setNoticias(resultado.data);
    } catch (erro) {
      console.log("Erro ao filtrar por categoria:", erro);
    }
  }

  async function deletarNoticia(id) {
    try {
      const resposta = await fetch(
        `http://localhost:3451/api/noticias/deletar/noticia/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      setNoticias((noticiasAtuais) =>
        noticiasAtuais.filter((noticia) => noticia.id !== id),
      );
    } catch (erro) {
      console.log("Erro ao deletar notícia:", erro);
    }
  }

  useEffect(() => {
    buscarNoticias();
    buscarFontes();
  }, []);

  function filtrarFonte(fonte) {
    setFonteSelecionada(fonte);
    setCategoriaSelecionada("");

    if (fonte === "") {
      buscarNoticias();
    } else {
      buscarNoticiasPorFonte(fonte);
    }
  }

  function filtrarCategoria(categoria) {
    setCategoriaSelecionada(categoria);
    setFonteSelecionada("");

    if (categoria === "") {
      buscarNoticias();
    } else {
      buscarNoticiasPorCategoria(categoria);
    }
  }

  function pegarCategorias() {
    const categorias = noticias.flatMap((noticia) =>
      noticia.categorias
        ? noticia.categorias
            .split(",")
            .map((categoria) => categoria.trim())
            .filter(Boolean)
        : [],
    );

    return [...new Set(categorias)];
  }

  return (
    <View style={styles.tela}>
      <Cabecario />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Notícias</Text>

        <View style={styles.filtros}>
          <Text style={styles.tituloFiltro}>Filtrar por fonte:</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollFiltros}
          >
            <Pressable
              style={[
                styles.botaoFiltro,
                fonteSelecionada === "" && styles.botaoSelecionado,
              ]}
              onPress={() => filtrarFonte("")}
            >
              <Text style={styles.textoFiltro}>Todas</Text>
            </Pressable>

            {fontes.map((fonte) => (
              <Pressable
                key={fonte.id}
                style={[
                  styles.botaoFiltro,
                  fonteSelecionada === fonte.titulo && styles.botaoSelecionado,
                ]}
                onPress={() => filtrarFonte(fonte.titulo)}
              >
                <Text style={styles.textoFiltro}>{fonte.titulo}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.tituloFiltro}>Filtrar por categoria:</Text>

          <View style={styles.categorias}>
            <Pressable
              style={[
                styles.botaoFiltro,
                categoriaSelecionada === "" && styles.botaoSelecionado,
              ]}
              onPress={() => filtrarCategoria("")}
            >
              <Text style={styles.textoFiltro}>Todas</Text>
            </Pressable>

            {pegarCategorias().map((categoria) => (
              <Pressable
                key={categoria}
                style={[
                  styles.botaoFiltro,
                  categoriaSelecionada === categoria && styles.botaoSelecionado,
                ]}
                onPress={() => filtrarCategoria(categoria)}
              >
                <Text style={styles.textoFiltro}>{categoria}</Text>
              </Pressable>
            ))}
          </View>
        </View>

      
        {noticias.length === 0 ? (
          <Text style={styles.semNoticias}>Nenhuma notícia encontrada.</Text>
        ) : (
          noticias.map((noticia) => (
            <View style={styles.card} key={noticia.id}>
              <Text style={styles.tituloNoticia}>{noticia.titulo}</Text>

              <Text style={styles.fonte}>Fonte: {noticia.fonte}</Text>

              <Text style={styles.data}>Data: {noticia.dataDePublicacao}</Text>

              <Text style={styles.categoria}>
                Categoria: {noticia.categorias}
              </Text>

              <Text style={styles.descricao}>{noticia.descricao}</Text>

              <Pressable
                style={styles.botaoExcluir}
                onPress={() => deletarNoticia(noticia.id)}
              >
                <Text style={styles.textoExcluir}>🗑️ Excluir notícia</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },

  conteudo: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#8999cc",
    flexGrow: 1,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },

  filtros: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#aad6f1",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  tituloFiltro: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d5063",
    marginBottom: 8,
  },

  scrollFiltros: {
    marginBottom: 15,
  },

  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  botaoFiltro: {
    backgroundColor: "#6796af",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  botaoSelecionado: {
    backgroundColor: "#406274",
  },

  textoFiltro: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  semNoticias: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 20,
  },

  card: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#aad6f1",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },

  tituloNoticia: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d5063",
    marginBottom: 10,
  },

  fonte: {
    fontWeight: "bold",
    color: "#406274",
  },

  data: {
    color: "#406274",
    marginTop: 5,
  },

  categoria: {
    color: "#406274",
    marginTop: 5,
  },

  descricao: {
    color: "#2d5063",
    marginTop: 10,
  },

  botaoExcluir: {
    backgroundColor: "#406274",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  textoExcluir: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
