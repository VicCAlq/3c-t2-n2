import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Cabecario from "../components/Cabecario";

export default function Sobre() {
  return (
    <View style={styles.tela}>
      <Cabecario />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#8ac5e9", "#8999cc", "#686f92"]}
          style={styles.fundo}
        >
          <Text style={styles.titulo}>Sobre Nós</Text>

          <View style={styles.card}>
            <Text style={styles.tituloCard}>Agregador de Notícias</Text>

            <Text style={styles.texto}>
              Este projeto foi desenvolvido como parte da atividade da N2 da
              matéria de Desenvolvimento Mobile e Backend do 2° Trimestre, com o
              objetivo de criar um agregador de notícias utilizando diferentes
              fontes de notícias atrvés de feeds RSS.
            </Text>

            <Text style={styles.texto}>
              A aplicação permite cadastrar fontes, visualizar suas notícias,
              filtrar conteúdos por fonte ou categoria e excluir registros.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.tituloCard}>Nossa proposta</Text>

            <Text style={styles.texto}>
              Passar uma ótima e agrádavel aplicação para nosso querido
              professor 🙏🙏
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.tituloCard}>Tecnologias utilizadas</Text>

            <View style={styles.tecnologias}>
              <View style={styles.tecnologia}>
                <Text style={styles.nomeTecnologia}>React Native</Text>
              </View>

              <View style={styles.tecnologia}>
                <Text style={styles.nomeTecnologia}>Expo</Text>
              </View>

              <View style={styles.tecnologia}>
                <Text style={styles.nomeTecnologia}>Node.js</Text>
              </View>

              <View style={styles.tecnologia}>
                <Text style={styles.nomeTecnologia}>Express</Text>
              </View>

              <View style={styles.tecnologia}>
                <Text style={styles.nomeTecnologia}>SQLite3</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.tituloCard}>Nossa equipe</Text>

            <Text style={styles.texto}>
              Projeto desenvolvido pelo Time 7 - 3°C.
            </Text>

            <Text style={styles.nome}>• GUILHERME GABRIEL MOURA DA SILVA</Text>

            <Text style={styles.nome}>• IZABELLA CRISTINE SILVA</Text>

            <Text style={styles.nome}>• LUCAS RENATO DE SOUZA SANTOS </Text>

            <Text style={styles.nome}>• MANUELLA SIQUEIRA DE ARAÚJO</Text>

            <Text style={styles.nome}>• PEDRO RENAN ALVES DE LIMA</Text>
          </View>

          <View style={styles.cardFinal}>
            <Text style={styles.frase}>
              Sua informação, nossa nota, minha alegria.
            </Text>

            <Text style={styles.subFrase}>
              Projeto acadêmico desenvolvido para a N2 do 2° Trimestre.
            </Text>
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

  conteudo: {
    flexGrow: 1,
  },

  fundo: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 25,
    marginTop: 10,
  },

  card: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#aad6f1",
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 5,
  },

  tituloCard: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d5063",
    marginBottom: 15,
    textAlign: "center",
  },

  texto: {
    fontSize: 16,
    color: "#406274",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10,
  },

  tecnologias: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
  },

  tecnologia: {
    backgroundColor: "#406274",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },

  nomeTecnologia: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  nome: {
    color: "#2d5063",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },

  cardFinal: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#406274",
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    alignItems: "center",
  },

  frase: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  subFrase: {
    color: "#cfedff",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
