import { View, Text, StyleSheet } from 'react-native'

export default function TabelaNoticias({ tabela }) {

      console.log("Tabela recebida:", tabela)

      if (!tabela) {
            return <h2>Tabela ainda não carregada</h2>
      } else {
            return (
                  <View style={styles.container}>

                        <Text style={styles.tituloPagina}>
                              Notícias
                        </Text>

                        {tabela?.map((noticia, key) => {

                              return (
                                    <View style={styles.card} key={key}>

                                          <Text style={styles.titulo}>
                                                {noticia.titulo}
                                          </Text>

                                          <Text style={styles.descricao}>
                                                {noticia.descricao}
                                          </Text>

                                          <Text style={styles.data}>
                                                Data: {noticia.dataDePublicacao}
                                          </Text>

                                          <Text style={styles.link}>
                                                {noticia.link}
                                          </Text>

                                    </View>
                              )
                        })}

                  </View>
            )
      }
}

const styles = StyleSheet.create({

      container: {
            width: '90%',
            marginTop: 20,
            marginBottom: 20,
      },

      tituloPagina: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 15,
      },

      card: {
            backgroundColor: '#fff',
            padding: 15,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
      },

      titulo: {
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 8,
      },

      descricao: {
            fontSize: 14,
            marginBottom: 8,
      },

      data: {
            fontSize: 12,
            color: '#666',
            marginBottom: 8,
      },

      link: {
            fontSize: 12,
            color: 'blue',
      },

})
