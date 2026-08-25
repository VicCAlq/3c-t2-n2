import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button
} from 'react-native';
import { useEffect, useState } from 'react';
export default function App() {
  const [noticias, setNoticias] = useState([]);
  const [fontes, setFontes] = useState([]);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const noticiasExemplo = [
    {
      id: 1,
      titulo: "Grupo de sobreviventes encontra possível caminho até antigo laboratório",
      categoria: "Saude",
      fonte: "Diário do Sobrevivente",
      endereco: "#"
    },
    {
      id: 2,
      titulo: "Vírus deixa cidades em estado de emergência após nova onda de contaminação",
      categoria: "Saude",
      fonte: "Notícias do Mundo",
      endereco: "#"
    },
    {
      id: 3,
      titulo: "Laboratório abandonado pode guardar pesquisas importantes para uma possível cura",
      categoria: "Ciencia",
      fonte: "Diário do Sobrevivente",
      endereco: "#"
    },
    {
      id: 4,
      titulo: "Sobreviventes enfrentam áreas perigosas para conseguir medicamentos",
      categoria: "Mundo",
      fonte: "Jornal da Cidade",
      endereco: "#"
    },
    {
      id: 5,
      titulo: "Especialistas alertam para os riscos de contato com pessoas infectadas",
      categoria: "Saude",
      fonte: "Notícias do Mundo",
      endereco: "#"
    }
  ];
  function carregarNoticias() {
    fetch('http://10.0.2.2:3000/api/noticias')
      .then(resposta => resposta.json())
      .then(dados => {
        if (dados.length > 0) {
          setNoticias(dados);
        } else {
          setNoticias(noticiasExemplo);
        }
      })
      .catch(erro => {
        console.log(erro);
        setNoticias(noticiasExemplo);
      });
  }
  function carregarFontes() {
    fetch('http://10.0.2.2:3000/api/fontes')
      .then(resposta => resposta.json())
      .then(dados => {
        setFontes(dados);
      })
      .catch(erro => {
        console.log(erro);
      });
  }
  function cadastrarFonte() {
    if (nome == '' || endereco == '') {
      alert('Preencha os campos');
      return;
    }
    fetch(
      'http://10.0.2.2:3000/api/fontes/cadastrar?nome=' +
      encodeURIComponent(nome) +
      '&endereco=' +
      encodeURIComponent(endereco)
    )
      .then(resposta => resposta.json())
      .then(dados => {
        alert(dados.message || dados.error);
        setNome('');
        setEndereco('');
        carregarFontes();
        carregarNoticias();
      })
      .catch(erro => {
        console.log(erro);
      });
  }
  function filtrarCategoria(categoria) {
    if (categoria == '') {
      carregarNoticias();
      return;
    }
    fetch(
      'http://10.0.2.2:3000/api/noticias/categoria/' +
      categoria
    )
      .then(resposta => resposta.json())
      .then(dados => {
        setNoticias(dados);
      })
      .catch(erro => {
        console.log(erro);
      });
  }
  function filtrarFonte(id) {
    if (id == '') {
      carregarNoticias();
      return;
    }
    fetch(
      'http://10.0.2.2:3000/api/noticias/fonte/' +
      id
    )
      .then(resposta => resposta.json())
      .then(dados => {
        setNoticias(dados);
      });
  }
  function apagarNoticia(id) {
    fetch(
      'http://10.0.2.2:3000/api/noticias/' + id,
      {
        method: 'DELETE'
      }
    )
      .then(resposta => resposta.json())
      .then(dados => {
        alert(dados.message);
        carregarNoticias();
      });
  }
  useEffect(() => {
    carregarNoticias();
    carregarFontes();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
{/* CABEÇALHO DO JORNAL */}
        <View style={styles.cabecalho}>
          <Text style={styles.nomeJornal}>
            O SOBREVIVENTE
          </Text>
          <Text style={styles.data}>
            EDIÇÃO ESPECIAL • 2026
          </Text>
        </View>
{/* MENU */}
        <View style={styles.menu}>
          <Text style={styles.menuTexto}>
            ÚLTIMAS NOTÍCIAS
          </Text>
          <Text style={styles.menuTexto}>
            SAÚDE
          </Text>
          <Text style={styles.menuTexto}>
            CIÊNCIA
          </Text>
          <Text style={styles.menuTexto}>
            MUNDO
          </Text>
        </View>
{/* MANCHETE */}
        <View style={styles.manchete}>
          <Text style={styles.chamada}>
            CRISE GLOBAL
          </Text>
          <Text style={styles.tituloPrincipal}>
            Sobreviventes encontram pistas de possível cura para o vírus
          </Text>
          <Text style={styles.resumo}>
            Grupo isolado parte em missão até um antigo laboratório
            de pesquisas médicas em busca de informações capazes
            de ajudar no desenvolvimento de uma cura.
          </Text>
        </View>
{/* NOTÍCIAS */}
        <View style={styles.areaNoticias}>
          <Text style={styles.tituloSecao}>
            ÚLTIMAS NOTÍCIAS
          </Text>
          {noticias.map((noticia) => (
            <View
              style={styles.noticia}
              key={noticia.id}
            >
              <Text style={styles.categoria}>
                {noticia.categoria}
              </Text>
              <Text style={styles.tituloNoticia}>
                {noticia.titulo}
              </Text>
              <Text style={styles.fonte}>
                {noticia.fonte}
              </Text>
              <Text style={styles.link}>
                {noticia.endereco}
              </Text>
              <View style={styles.botaoApagar}>
                <Button
                  title="Apagar"
                  color="#b00000"
                  onPress={() =>
                    apagarNoticia(noticia.id)
                  }
                />
              </View>
            </View>
          ))}
        </View>
{/* FILTROS */}
        <View style={styles.areaFiltros}>
          <Text style={styles.tituloSecao}>
            FILTRAR NOTÍCIAS
          </Text>
          <Text style={styles.nomeFiltro}>
            CATEGORIA
          </Text>
          <View style={styles.filtro}>
            <Button
              title="Todas"
              onPress={() => filtrarCategoria('')}
            />
            <Button
              title="Saúde"
              onPress={() => filtrarCategoria('Saude')}
            />
            <Button
              title="Ciência"
              onPress={() => filtrarCategoria('Ciencia')}
            />
            <Button
              title="Mundo"
              onPress={() => filtrarCategoria('Mundo')}
            />
          </View>
          <Text style={styles.nomeFiltro}>
            FONTE
          </Text>
          <Button
            title="Todas as fontes"
            onPress={() => filtrarFonte('')}
          />
          {fontes.map((fonte) => (
            <View
              key={fonte.id}
              style={styles.fonteBotao}
            >
              <Button
                title={fonte.nome}
                onPress={() =>
                  filtrarFonte(fonte.id)
                }
              />
            </View>
          ))}
        </View>
{/* CADASTRAR FONTE */}
        <View style={styles.cadastro}>
          <Text style={styles.tituloSecao}>
            ADICIONAR FONTE
          </Text>
          <Text style={styles.textoCadastro}>
            Adicione uma nova fonte de notícias ao jornal.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da fonte"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Link da fonte"
            value={endereco}
            onChangeText={setEndereco}
          />
          <Button
            title="ADICIONAR FONTE"
            onPress={cadastrarFonte}
            color="#222"
          />
        </View>
{/* RODAPÉ */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            O SOBREVIVENTE
          </Text>
          <Text style={styles.rodapePequeno}>
            Informação em tempos de crise.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  cabecalho: {
    backgroundColor: "#111",
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  nomeJornal: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    letterSpacing: 2
  },
  data: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 5
  },
  menu: {
    backgroundColor: "#b00000",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12
  },
  menuTexto: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold"
  },
  manchete: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa"
  },
  chamada: {
    color: "#b00000",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8
  },
  tituloPrincipal: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 34,
    color: "#111"
  },
  resumo: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    lineHeight: 23
  },
  areaNoticias: {
    padding: 15
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    borderBottomWidth: 2,
    borderBottomColor: "#b00000",
    paddingBottom: 8,
    marginBottom: 15
  },
  noticia: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  categoria: {
    color: "#b00000",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase"
  },
  tituloNoticia: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 5,
    color: "#111"
  },
  fonte: {
    marginTop: 8,
    color: "#666",
    fontSize: 13
  },
  link: {
    color: "#555",
    fontSize: 12,
    marginTop: 5
  },
  botaoApagar: {
    marginTop: 10,
    width: 100
  },
  areaFiltros: {
    backgroundColor: "#e8e8e8",
    padding: 15,
    marginTop: 10
  },
  nomeFiltro: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 5
  },
  filtro: {
    gap: 5,
    marginBottom: 15
  },
  fonteBotao: {
    marginTop: 5
  },
  cadastro: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 10
  },
  textoCadastro: {
    color: "#555",
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white"
  },
  rodape: {
    backgroundColor: "#111",
    padding: 30,
    alignItems: "center",
    marginTop: 20
  },
  rodapeTexto: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  rodapePequeno: {
    color: "#aaa",
    marginTop: 5
  }
});;