import { useState } from "react";
import { Pressable, View } from "react-native";


export default function Cadastrar ()
{
    const [inserir, setInserir] = useState('');
    let titulo;
    let fonte;
    let link;
    let descricao;
    let data;
    let categorias
    async function enviarLink() {
        const endereco = new URLSearchParams({ link: inserir })
        await fetch(`http://localhost:3000/api/fontes/cadastrar?${endereco}`).then((resposta) => {
            if (!resposta.ok) { throw new Error(`Erro: ${resposta.status}`) }
            return resposta.json()
        })
            .then(() => {
                endereco.titulo  = titulo
                endereco.fonte  = fonte
                endereco.link = link
                endereco.descricao  = descricao
                endereco.dataDePublicacao = data
                endereco.categorias   = categorias
            })
            .catch((erro) => {
                console.error(`Erro: ${erro}`)
            })


            return(
                <View>
                    <Pressable>
                       
                    </Pressable>
                </View>
            )
}
}

