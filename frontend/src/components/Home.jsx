import { Text, View } from "react-native";

export default function Home({ children }) {
    
 const [ endereco, setEndereco ] = useState("")

  async function cadastrarFeed(url) {
    const query = new URLSearchParams('link', url)
    await fetch(`http://localhost:3000/api/fontes/cadastrar?${query}`)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`)
      }
      return resposta.json()
    })
    .then((resultado) => {
      // Aqui você decide como usar o resultado enviado pelo servidor
    })
    .catch((erro) => {
      // Vou usar "window.alert" pra exibir o erro aqui a fim de
      // que fique mais fácil para vocês identificarem se algo der errado
    })
  }

  return(<View>
    <Text>{children}</Text>
  </View>)
}
