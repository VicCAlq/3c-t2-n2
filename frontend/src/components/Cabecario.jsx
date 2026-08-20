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
         width: '30vw',
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
         width: '30vw',
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
         width: '30vw',
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
        width:'100vw',
        justifyContent: 'center',
        
       
    },
    viewInicial: {

        height:'5vh',
          width:'100vw',
        backgroundColor: '#67b9e6'
    }


})
export default function Cabecario({}) {
    const  [hover, setHover1] = useState(false);
    const  [hover2, setHover2] = useState(false);
    const  [hover3, setHover3] = useState(false);

    return  (

          <View>
        <View style = {estilo.viewInicial}>
            </View>
                  
        <View style = {estilo.viewBotoes}>
       
            <Pressable style = {[estilo.botao1, hover && estilo.hover1]}
            onHoverIn={() => setHover1(true)} 
            onHoverOut={() => setHover1(false)}>
                <Text  style = {[estilo.texto1, hover && estilo.texto1Hover]}
            onHoverIn={() => setHover1(true)} 
            onHoverOut={() => setHover1(false)}
               >Página Inicial </Text>
            </Pressable>


              <Pressable style = {[estilo.botao2, hover2 && estilo.hover2]}
    
            onHoverIn={() => setHover2(true)} 
            onHoverOut={() => setHover2(false)}>
                <Text  style = {[estilo.texto2, hover2 && estilo.texto2Hover]}
            onHoverIn={() => setHover2(true)} 
            onHoverOut={() => setHover2(false)}
               >Notícias</Text>
            </Pressable>


              <Pressable style = {[estilo.botao3, hover3 && estilo.hover3]}
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
