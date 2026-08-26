import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Exemplo from './components/Exemplo';
import { useState, useEffect } from 'react';
import FiltrosNoticias from './components/FiltrosNoticias';
import CadastroFeed from './components/CadastroFeed';
import TabelaNoticias from './components/TabelaNoticias';

export default function App() {

  // Aqui você vai armazenar o link do RSS
  const [ endereco, setEndereco ] = useState("")
  // Aqui você vai armazenar a tabela de notícias enviadas pelo backend
  const [ tabela, setTabela ] = useState(new Array(0))
  // Aqui você vai armazenar a fonte de notícias selecionada
  const [ fonte, setFonte ] = useState("")
  // Aqui você vai armazenar a categoria de notícias selecionada
  const [ categoria, setCategoria ] = useState("")
  const [ fontes, setFontes ] = useState([])
  const [ categorias, setCategorias ] = useState([])
  useEffect(() => {
  buscarCategorias()
  buscarFontes()
}, [])

  // função que envia o endereço pro backend pra gerar as notícias
  async function cadastrarFeed(endereco) {
    const link = new URLSearchParams({link: endereco})
    const enderecoApi = `http://localhost:3451/api/fontes/cadastrar/?${link}`
    console.log("Enviando:", enderecoApi)
    await fetch(enderecoApi, {method: "GET"})
      .then(resposta => { return resposta.json() })
      .then(resultado => {console.log("Resposta do Backend:", resultado),
         console.log("NOTÍCIAS RECEBIDAS:", resultado.noticias),
          setTabela(resultado.noticias) })
  }

  async function buscarCategorias() {
    await fetch(
      'http://localhost:3451/api/categorias/'
    ).then(resposta => { return resposta.json() })
    .then(resultado => {console.log("Resposta do Backend:", resultado),
        console.log("Categorias:", resultado)
        setCategorias(resultado.categorias)
      })
  }

async function buscarFontes() {
  const resposta = await fetch(
    'http://localhost:3451/api/fontes/'
  )

  const resultado = await resposta.json()

  console.log("Fontes:", resultado)

  setFontes(resultado.fontes)
}

async function filtrarPorCategoria(categoria) {
  setCategoria(categoria)

  const resposta = await fetch(
    `http://localhost:3451/api/noticias/categoria/${encodeURIComponent(categoria)}`
  )

  const resultado = await resposta.json()

  setTabela(resultado.noticias)
}


async function filtrarPorFonte(fonte) {
  setFonte(fonte)

  const resposta = await fetch(
    `http://localhost:3451/api/noticias/fonteNoticia/${encodeURIComponent(fonte)}`
  )

  const resultado = await resposta.json()

  setTabela(resultado.data)
}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text>Site do Time 3 da Melhor Turma 3C</Text>
        <CadastroFeed
          endereco={endereco}
          setEndereco={setEndereco}
          cadastrarFeed={cadastrarFeed}
        />
        <FiltrosNoticias
          fontes={fontes}
          categorias={categorias}
          filtrarPorFonte={filtrarPorFonte}
          filtrarPorCategoria={filtrarPorCategoria}
        />
        <TabelaNoticias
          tabela={tabela}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#f2f5f7',
},
  title: {
    color: "#101015"
  },
  conteudo: {
  alignItems: 'center',
  paddingVertical: 35,
  paddingBottom: 60
},

tituloPagina: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#17202a',
  marginBottom: 5
},

subtitulo: {
  fontSize: 16,
  color: '#666',
  marginBottom: 10
},
});
