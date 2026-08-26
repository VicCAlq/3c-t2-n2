import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'

export default function FiltrosNoticias({
      fontes,
      categorias,
      filtrarPorFonte,
      filtrarPorCategoria
}) {

      const [mostrarFontes, setMostrarFontes] = useState(false)
      const [mostrarCategorias, setMostrarCategorias] = useState(false)

      return (
            <View style={styles.container}>

                  {/* Menu de categorias */}
                  <View>

                        <Pressable
                              style={styles.menu}
                              onPress={() => {
                                    setMostrarCategorias(!mostrarCategorias)
                                    setMostrarFontes(false)
                              }}
                        >
                              <Text>Filtrar por categoria</Text>
                        </Pressable>

                        {mostrarCategorias && (
                              <View style={styles.opcoes}>

                                    {categorias.map((categoria, key) => (
                                          <Pressable
                                                key={key}
                                                style={styles.opcao}
                                                onPress={() => {
                                                      filtrarPorCategoria(categoria)
                                                      setMostrarCategorias(false)
                                                }}
                                          >
                                                <Text>{categoria}</Text>
                                          </Pressable>
                                    ))}

                              </View>
                        )}

                  </View>


                  {/* Menu de fontes */}
                  <View>

                        <Pressable
                              style={styles.menu}
                              onPress={() => {
                                    setMostrarFontes(!mostrarFontes)
                                    setMostrarCategorias(false)
                              }}
                        >
                              <Text>Filtrar por fonte</Text>
                        </Pressable>

                        {mostrarFontes && (
                              <View style={styles.opcoes}>

                                    {fontes.map((fonte, key) => (
                                          <Pressable
                                                key={key}
                                                style={styles.opcao}
                                                onPress={() => {
                                                      filtrarPorFonte(fonte.nome)
                                                      setMostrarFontes(false)
                                                }}
                                          >
                                                <Text>{fonte.nome}</Text>
                                          </Pressable>
                                    ))}

                              </View>
                        )}

                  </View>

            </View>
      )
}

const styles = StyleSheet.create({

      container: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 15,
      },

      menu: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: '#fff',
      },

      opcoes: {
            borderWidth: 1,
            marginTop: 2,
            backgroundColor: '#fff',
      },

      opcao: {
            padding: 10,
            borderBottomWidth: 1,
      },

})
