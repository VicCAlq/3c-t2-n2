import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Inicio from "./screens/Inicio";
import Noticias from "./screens/Noticias";
import Sobre from "./screens/Sobre";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tab.Screen name="Inicio" component={Inicio} />
        <Tab.Screen name="Noticias" component={Noticias} />
        <Tab.Screen name="Sobre" component={Sobre} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
