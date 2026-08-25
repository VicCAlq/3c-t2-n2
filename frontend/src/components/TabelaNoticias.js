importimport {View, TextInput, Pressable, Text} from 'react-native'

export default function TabelaNoticias({ 
      tabela 
}) {
      return <>
            <table>
                  <thead>
                        <tr>
                              <td>Título</td>
                              <td>Link</td>
                              <td>Data de Publicação</td>
                        </tr>
                  </thead>
                  <tbody>
                        {tabela.map((noticia, key) => {
                              return <tr key={key}>
                                    <td>{noticia.titulo}</td>
                                    <td>{noticia.link}</td>
                                    <td>{noticia.dataPublicacao}</td>
                              </tr>
                        })}
                  </tbody>
            </table>
      </>
}