import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Exemplo from './components/Exemplo';
import { useState } from 'react';
import CadastroFeed from './components/cadastroFeed';
import TabelaNoticias from './components/tabelaNoticias';

export default function App() {

  // Aqui você vai armazenar o link do RSS
  const [ endereco, setEndereco ] = useState("")
  // Aqui você vai armazenar a tabela de notícias enviadas pelo backend
  const [ tabela, setTabela ] = useState("")
  // Aqui você vai armazenar a fonte de notícias selecionada
  const [ fonte, setFonte ] = useState("")
  // Aqui você vai armazenar a categoria de notícias selecionada
  const [ categoria, setCategoria ] = useState("")

  // função que envia o endereço pro backend pra gerar as notícias
  async function cadastrarFeed(endereco) {
    const link = new URLSearchParams({link: endereco})
    const enderecoApi = `http://localhost:3451/api/fontes/cadastrar/?${link}`
    console.log(enderecoApi)
    await fetch(enderecoApi, {method: "GET"})
      .then(resposta => { return resposta.json() })
      .then(resultado => { setTabela(resultado.noticias) })
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Comece aqui seu projeto Mobile</Text>
        <CadastroFeed
          endereco={endereco}
          setEndereco={setEndereco}
          cadastrarFeed={cadastrarFeed}
        />
        <TabelaNoticias
          tabela={tabela}
        />
        <Exemplo>Este é um componente de exemplo</Exemplo>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eec",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: "#101015"
  }
});
