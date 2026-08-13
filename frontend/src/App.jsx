import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'http://localhost:3000';

export default function App() {

  const [noticias, setNoticias] = useState([]);
  const [fontes, setFontes] = useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [fonteSelecionada, setFonteSelecionada] = useState('');

  const [nomeFonte, setNomeFonte] = useState('');
  const [enderecoFonte, setEnderecoFonte] = useState('');

  const [carregando, setCarregando] = useState(false);



  async function carregarFontes() {

    try {

      const resposta = await fetch(`${API_URL}/api/fontes`);

      const dados = await resposta.json();

      setFontes(dados);

    } catch (erro) {

      console.error('Erro ao buscar fontes:', erro);

    }
  }


  async function carregarNoticias() {

    setCarregando(true);

    try {

      let url = `${API_URL}/api/noticias`;

      if (categoriaSelecionada) {

        url = `${API_URL}/api/noticias/categoria/${encodeURIComponent(categoriaSelecionada)}`;

      } else if (fonteSelecionada) {

        url = `${API_URL}/api/noticias/fonte/${fonteSelecionada}`;

      }

      const resposta = await fetch(url);

      const dados = await resposta.json();

      setNoticias(dados);

    } catch (erro) {

      console.error('Erro ao buscar notícias:', erro);

    } finally {

      setCarregando(false);
    }
  }


  async function cadastrarFonte() {

    if (!nomeFonte || !enderecoFonte) {

      alert('Preencha o nome e o endereço da fonte.');

      return;
    }

    try {

      const resposta = await fetch(`${API_URL}/api/fontes`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          nome: nomeFonte,
          endereco: enderecoFonte,
        }),

      });

      const dados = await resposta.json();

      if (!resposta.ok) {

        alert(dados.message || 'Erro ao cadastrar fonte.');

        return;
      }

      alert('Fonte cadastrada com sucesso!');

      setNomeFonte('');
      setEnderecoFonte('');

      carregarFontes();

    } catch (erro) {

      console.error('Erro ao cadastrar fonte:', erro);

      alert('Não foi possível conectar ao servidor.');
    }
  }


  useEffect(() => {

    carregarFontes();
    carregarNoticias();

  }, []);



  useEffect(() => {

    carregarNoticias();

  }, [categoriaSelecionada, fonteSelecionada]);



  const categorias = [
    ...new Set(
      noticias
        .map((noticia) => noticia.categoria)
        .filter(Boolean)
    )
  ];


  return (

    <ScrollView style={styles.tela}>

      <View style={styles.container}>

        <Text style={styles.titulo}>
          Agregador de Notícias
        </Text>


        <View style={styles.card}>

          <Text style={styles.subtitulo}>
            Cadastrar nova fonte
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da fonte"
            value={nomeFonte}
            onChangeText={setNomeFonte}
          />

          <TextInput
            style={styles.input}
            placeholder="Link da fonte"
            value={enderecoFonte}
            onChangeText={setEnderecoFonte}
            autoCapitalize="none"
            keyboardType="url"
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={cadastrarFonte}
          >

            <Text style={styles.textoBotao}>
              Adicionar fonte
            </Text>

          </TouchableOpacity>

        </View>


       

        <View style={styles.card}>

          <Text style={styles.subtitulo}>
            Filtrar notícias
          </Text>


          <Text style={styles.label}>
            Categoria
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtros}
          >

            <TouchableOpacity
              style={
                categoriaSelecionada === ''
                  ? styles.filtroSelecionado
                  : styles.filtro
              }
              onPress={() => {

                setCategoriaSelecionada('');
                setFonteSelecionada('');

              }}
            >

              <Text>
                Todas
              </Text>

            </TouchableOpacity>


            {categorias.map((categoria) => (

              <TouchableOpacity
                key={categoria}
                style={
                  categoriaSelecionada === categoria
                    ? styles.filtroSelecionado
                    : styles.filtro
                }
                onPress={() => {

                  setCategoriaSelecionada(categoria);
                  setFonteSelecionada('');

                }}
              >

                <Text>
                  {categoria}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>


          <Text style={styles.label}>
            Fonte
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtros}
          >

            <TouchableOpacity
              style={
                fonteSelecionada === ''
                  ? styles.filtroSelecionado
                  : styles.filtro
              }
              onPress={() => {

                setFonteSelecionada('');
                setCategoriaSelecionada('');

              }}
            >

              <Text>
                Todas
              </Text>

            </TouchableOpacity>


            {fontes.map((fonte) => (

              <TouchableOpacity
                key={fonte.id}
                style={
                  fonteSelecionada === String(fonte.id)
                    ? styles.filtroSelecionado
                    : styles.filtro
                }
                onPress={() => {

                  setFonteSelecionada(String(fonte.id));
                  setCategoriaSelecionada('');

                }}
              >

                <Text>
                  {fonte.nome}
                </Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

        </View>


   
        {/* NOTÍCIAS */}
      

        <Text style={styles.subtitulo}>
          Notícias
        </Text>


        {carregando ? (

          <ActivityIndicator size="large" />

        ) : noticias.length === 0 ? (

          <View style={styles.card}>

            <Text>
              Nenhuma notícia encontrada.
            </Text>

          </View>

        ) : (

          noticias.map((noticia) => (

            <View
              key={noticia.id}
              style={styles.noticia}
            >

              <Text style={styles.tituloNoticia}>
                {noticia.titulo}
              </Text>

              <Text style={styles.categoriaNoticia}>
                {noticia.categoria}
              </Text>

              <Text style={styles.fonteNoticia}>
                Fonte: {noticia.fonte_nome}
              </Text>

              <Text style={styles.descricao}>
                {noticia.descricao}
              </Text>

              <Text style={styles.data}>
                {noticia.dataPublicacao}
              </Text>

            </View>

          ))

        )}

      </View>

    </ScrollView>

  );
}


const styles = StyleSheet.create({

  tela: {
    flex: 1,
    backgroundColor: '#eeeecc',
  },

  container: {
    padding: 20,
    paddingTop: 50,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#101015',
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },

  botao: {
    backgroundColor: '#333333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 5,
  },

  filtros: {
    marginBottom: 15,
  },

  filtro: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#ffffff',
  },

  filtroSelecionado: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#cccccc',
  },

  noticia: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  tituloNoticia: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  categoriaNoticia: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  fonteNoticia: {
    fontSize: 14,
    marginBottom: 8,
  },

  descricao: {
    fontSize: 15,
    marginBottom: 8,
  },

  data: {
    fontSize: 12,
    color: '#666666',
  },

});
