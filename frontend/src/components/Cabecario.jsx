import { View, Pressable, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const estilo = StyleSheet.create({
  cabecario: {
    width: "100%",
    backgroundColor: "#67b9e6",
  },

  topo: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#67b9e6",
  },

  tituloApp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },

  viewBotoes: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },

  botao1: {
    flex: 1,
    backgroundColor: "#80b2cd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
  },

  botao2: {
    flex: 1,
    backgroundColor: "#6796af",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },

  botao3: {
    flex: 1,
    backgroundColor: "#406274",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
  },

  hover1: {
    backgroundColor: "#9acde8",
  },

  hover2: {
    backgroundColor: "#78afd0",
  },

  hover3: {
    backgroundColor: "#558199",
  },

  texto1: {
    color: "#2d5063",
    fontWeight: "bold",
    fontSize: 15,
  },

  texto1Hover: {
    color: "#1f455b",
  },

  texto2: {
    color: "#cfedff",
    fontWeight: "bold",
    fontSize: 15,
  },

  texto2Hover: {
    color: "#ffffff",
  },

  texto3: {
    color: "#cfedff",
    fontWeight: "bold",
    fontSize: 15,
  },

  texto3Hover: {
    color: "#ffffff",
  },
});

export default function Cabecario() {
  const navigation = useNavigation();

  const [hover, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  const [hover3, setHover3] = useState(false);

  return (
    <View style={estilo.cabecario}>
      <View style={estilo.topo}>
        <Text style={estilo.tituloApp}>Agregador de Notícias</Text>
      </View>

      <View style={estilo.viewBotoes}>
        <Pressable
          style={[estilo.botao1, hover && estilo.hover1]}
          onHoverIn={() => setHover1(true)}
          onHoverOut={() => setHover1(false)}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Text style={[estilo.texto1, hover && estilo.texto1Hover]}>
            Página Inicial
          </Text>
        </Pressable>

        <Pressable
          style={[estilo.botao2, hover2 && estilo.hover2]}
          onHoverIn={() => setHover2(true)}
          onHoverOut={() => setHover2(false)}
          onPress={() => navigation.navigate("Noticias")}
        >
          <Text style={[estilo.texto2, hover2 && estilo.texto2Hover]}>
            Notícias
          </Text>
        </Pressable>

        <Pressable
          style={[estilo.botao3, hover3 && estilo.hover3]}
          onHoverIn={() => setHover3(true)}
          onHoverOut={() => setHover3(false)}
          onPress={() => navigation.navigate("Sobre")}
        >
          <Text style={[estilo.texto3, hover3 && estilo.texto3Hover]}>
            Sobre Nós
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
