import { View } from "react-native";
import Filtragem from "./Filtragem";
import InserirNovaFonte from "./InserirNovaFonte";

export default function ExibirUI({}){
    return(
        <View>
            <Filtragem />
            <InserirNovaFonte/>
        </View>
    )
}