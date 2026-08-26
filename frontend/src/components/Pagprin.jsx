







import { useState } from "react";
import { View, Text, TextInput, StyleSheet, SectionList } from "react-native";




const estilo = StyleSheet.create({
    texto: {
        fontSize: 12,
        color: 'black',
    },
    input: {
        backgroundColor: 'blue',
    },
})








export default function Pagprin() {
    const [inserir, setInserir] = useState('');
    const [cadastrados, setCadastrados] = useState('');




    async function enviarLink() {
        const endereco = new URLSearchParams({ link: inserir })
        await fetch(`http://localhost:3000/api/fontes/cadastrar?${endereco}`).then((resposta) => {
            if (!resposta.ok) { throw new Error(`Erro: ${resposta.status}`) }
            return resposta.json()
        })
            .then((inserir) => {
                { inserir.titulo }
                { inserir.fonte }
                { inserir.link }
                { inserir.descricao }
                { inserir.dataDePublicacao }
                { inserir.categorias }
            })
            .catch((erro) => {
                console.error(`Erro: ${erro}`)
            })
    }
















    return (








        <View>
            <View>
                <Text style={estilo.texto}>
                    insira uma nova fonte de notícias aqui
                </Text>
                <TextInput style={estilo.input}
                    value={inserir}
                    keyboardType="url"
                    onChangeText={setInserir}
                    placeholder={"fonte..."}
                />
            </View>
            <View>
                <SectionList
                    sections={[{ title: 'filtro', data: [] }, { title: 'conteudos', data: [] }]} renderItem={({ item }) =>
                        <Text>{item}</Text>
                    }
                    renderSectionHeader={({ section }) => (
                        <Text>{section.title}</Text>)}
                    keyExtractor={item => `basicListEntry-${item}`}
                />
            </View>
        </View>
    )








}























