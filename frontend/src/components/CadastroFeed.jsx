import {View, TextInput, Pressable, Text} from 'react-native'

export default function CadastroFeed({ 
      endereco, 
      setEndereco, 
      cadastrarFeed 
}) {
      return <View>
            <TextInput
                  value={endereco}
                  onChangeText={setEndereco}
            />
            <Pressable
                  onPress={() => {
                        console.log("endereco enviado: " + endereco)
                        cadastrarFeed(endereco)
                  }}
            >
                  <Text>Envir feed</Text>
            </Pressable>
      </View>
}