import { useEffect, useState } from "react";

import { View, Text, TextInput, Pressable, StyleSheet, ScrollView,} from "react-native";

import Cabecario from "../components/Cabecario";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio() {
  const [link, setLink] = useState("");
  const [fontes, setFontes] = useState([]);

  async function cadastrarFeed(url) {
    const query = new URLSearchParams({ link: url });

    await fetch(`http://localhost:3451/api/fontes/cadastrar?${query}`)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`Erro: ${resposta.status}`);
        }

        return resposta.json();
      })
      .then((resultado) => {
        console.log("Resultado:", resultado);

        setLink("");
        buscarFontes();
      })
      .catch((erro) => {
        console.log("Erro:", erro);
      });
  }

  function cadastrar() {
    if (!link.trim()) {
      console.log("Digite um link.");
      return;
    }

    cadastrarFeed(link);
  }

  useEffect(() => {
    buscarFontes();
  }, []);

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

  async function deletarFonte(id) {
    try {
      const resposta = await fetch(
        `http://localhost:3451/api/fontes/deletar/fonte/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }

      setFontes(fontes.filter((fonte) => fonte.id !== id));
    } catch (erro) {
      console.log("Erro ao deletar fonte:", erro);
    }
  }

  return (
    <View style={styles.tela}>
      <Cabecario />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <LinearGradient
          colors={["#8ac5e9", "#8999cc", "#686f92"]}
          style={styles.conteudo}
        >
          <View style={styles.card}>
            <Text style={styles.titulo}>Cadastrar fonte de notícias</Text>

            <Text style={styles.descricao}>Insira o link de um feed RSS:</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu feed aqui!!"
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <Pressable style={styles.botao} onPress={cadastrar}>
              <Text style={styles.textoBotao}>Cadastrar fonte</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.titulo}>Fontes cadastradas</Text>

            {fontes.length === 0 ? (
              <Text style={styles.descricao}>Nenhuma fonte cadastrada.</Text>
            ) : (
              fontes.map((fonte) => (
                <View style={styles.fonte} key={fonte.id}>
                  <Text style={styles.nomeFonte}>{fonte.titulo}</Text>

                  <Text style={styles.linkFonte}>{fonte.link}</Text>

                  <Pressable
                    style={styles.botaoExcluir}
                    onPress={() => deletarFonte(fonte.id)}
                  >
                    <Text style={styles.textoExcluir}>Excluir fonte</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  conteudo: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#aad6f1",
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d5063",
    textAlign: "center",
    marginBottom: 10,
  },

  descricao: {
    fontSize: 16,
    color: "#406274",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: "#406274",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  fonte: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  nomeFonte: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5063",
  },

  linkFonte: {
    fontSize: 13,
    color: "#406274",
    marginTop: 5,
  },

  botaoExcluir: {
    backgroundColor: "#9b4141",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  textoExcluir: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
