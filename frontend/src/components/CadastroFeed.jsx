import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'

export default function CadastroFeed({ endereco, setEndereco, cadastrarFeed }) {

      return (
            <View style={styles.container}>

                  <TextInput
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Cole/Digite aqui o feed RSS"
                  />

                  <Pressable onPress={() => cadastrarFeed(endereco)}>
                    <Text style={styles.card}>Enviar Feed RSS</Text>
                  </Pressable>

            </View>
      )
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
