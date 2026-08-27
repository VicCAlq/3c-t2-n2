  import { View, Pressable, Text, StyleSheet } from 'react-native';
 import { useState } from 'react';
 

const estilo = StyleSheet.create ({
    texto1: {
    color: '#2d5063ff',
    fontWeight:'bold',
    fontSize: '15',
    textAlign:'center',
    padding:"2px"


    },
     texto1Hover: {
    color: '#396983',
    fontWeight:'bold',
    fontSize: '15',
    textAlign:'center',
    padding:"2px"


    },
    botao1: {
        backgroundColor: '#80b2cd',
         padding: '10px',
         margin: '0px',
         flex: 1,
         height: '5vw',
         justifyContent: 'center',
        alignItems:'center',
         borderBottomLeftRadius:'60px'

    },
    hover1: {
        backgroundColor:'#8cbed8',
    },



       texto2: {
        color: '#cfedff',
    fontWeight:'bold',
    fontSize: '15',
    textAlign:'center'
    },
     texto2Hover: {
    color: '#ffffff',
    fontWeight:'bold',
    fontSize: '15',
    textAlign:'center',
    padding:"2px" },
    botao2: {
        backgroundColor: '#6796af',
         padding: '10px',
         margin: '0px',
         flex: 1,
         height: '5vw',
         justifyContent: 'center',
        alignItems:'center',
    } ,
    hover2: {
        backgroundColor:'#77afce',
    },



       texto3: {
        color: '#cfedff',
    fontWeight:'bold',
    fontSize: '20',
    textAlign:'center'
    },
     texto3Hover: {
    color: '#ffffff',
    fontWeight:'bold',
    fontSize: '15',
    textAlign:'center',
    padding:"2px"},
    botao3: {
        backgroundColor: '#406274ff',
         padding: '10px',
         margin: '0px',
         flex: 1,
         height: '5vw',
         justifyContent: 'center',
        alignItems:'center',
         borderBottomRightRadius:'60px'
    },
    hover3: {
        backgroundColor:'rgb(85, 129, 153)',
    },




    viewBotoes: {
        flex:1,
         height: '20vh',
         backgroundColor:'#8ac5e9',
        flexDirection: 'row',
        alignItems:'center',
        width:'100%',
        justifyContent: 'center',
        
       
    },
    viewInicial: {

        height:'5vh',
          width:'100%',
          backgroundColor: '#67b9e6',
          position: 'relative',
          zIndex: 20
        },
        viewInicialEscuro: { backgroundColor: '#050b16' },
        viewBotoesEscuro: { backgroundColor: '#050b16' },
        botaoEscuro: { backgroundColor: '#101b2d' },
        botaoTema: { position: 'absolute', right: 16, top: 6, backgroundColor: '#f4c400', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 5, zIndex: 30, elevation: 5 },
        textoTema: { color: '#050b16', fontWeight: 'bold', fontSize: 13 }


})
export default function Cabecario({ onNavigate, escuro, onToggleTema }) {
    const  [hover, setHover1] = useState(false);
    const  [hover2, setHover2] = useState(false);
    const  [hover3, setHover3] = useState(false);

    return  (

          <View>
        <View style = {[estilo.viewInicial, escuro && estilo.viewInicialEscuro]}>
            <Pressable onPress={onToggleTema} style={estilo.botaoTema} accessibilityLabel="Alternar modo escuro">
                <Text style={estilo.textoTema}>{escuro ? "Modo claro" : "Modo escuro"}</Text>
            </Pressable>
            </View>
                  
        <View style = {[estilo.viewBotoes, escuro && estilo.viewBotoesEscuro]}>
       
            <Pressable style = {[estilo.botao1, escuro && estilo.botaoEscuro, hover && estilo.hover1]}
            onPress={() => onNavigate?.("inicio")}
            onHoverIn={() => setHover1(true)} 
            onHoverOut={() => setHover1(false)}>
                <Text  style = {[estilo.texto1, hover && estilo.texto1Hover]}
            onHoverIn={() => setHover1(true)} 
            onHoverOut={() => setHover1(false)}
               >Página Inicial </Text>
            </Pressable>


              <Pressable style = {[estilo.botao2, escuro && estilo.botaoEscuro, hover2 && estilo.hover2]}
                        onPress={() => onNavigate?.("noticias")}
    
            onHoverIn={() => setHover2(true)} 
            onHoverOut={() => setHover2(false)}>
                <Text  style = {[estilo.texto2, hover2 && estilo.texto2Hover]}
            onHoverIn={() => setHover2(true)} 
            onHoverOut={() => setHover2(false)}
               >Notícias</Text>
            </Pressable>


              <Pressable style = {[estilo.botao3, escuro && estilo.botaoEscuro, hover3 && estilo.hover3]}
                        onPress={() => onNavigate?.("sobre")}
            onHoverIn={() => setHover3(true)} 
            onHoverOut={() => setHover3(false)}>
                <Text  style = {[estilo.texto3, hover3 && estilo.texto3Hover]}
            onHoverIn={() => setHover3(true)} 
            onHoverOut={() => setHover3(false)}
               >Sobre Nós</Text>
            </Pressable>

          </View>


        
        </View>
       


    )
}
