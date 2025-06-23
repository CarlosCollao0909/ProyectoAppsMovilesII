import { StyleSheet, Platform } from 'react-native';

// Dependencias de navegación
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Pantallas
import Home from './screens/home';
import Graphic from './screens/graphic';
import Sales from './screens/sales';
import Settings from './screens/settings';

// Crear el Tab Navigator Inferior
const Tab = createBottomTabNavigator();

// Colores del tema
const colors = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#f093fb',
  background: '#ffffff',
  surface: '#f8fafc',
  inactive: '#64748b',
  shadow: '#000000',
  text: '#1e293b',
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let nombreIcono;

            switch (route.name) {
              case 'Inicio':
                nombreIcono = focused ? 'home' : 'home-outline';
                break;
              case 'Grafica':
                nombreIcono = focused ? 'analytics' : 'analytics-outline';
                break;
              case 'Ventas':
                nombreIcono = focused ? 'card' : 'card-outline';
                break;
              case 'Ajustes':
                nombreIcono = focused ? 'settings' : 'settings-outline';
                break;
              default:
                nombreIcono = 'help-outline';
            }

            return <Ionicons name={nombreIcono} size={size} color={color} />;
          },
          // Estilos del header
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: colors.text,
          },
          headerTitleAlign: 'center',
          
          // Estilos de la tab bar
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: Platform.OS === 'ios' ? 0 : 5,
          },
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 85 : 65,
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          // Animación suave
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen 
          name="Inicio" 
          component={Home}
          options={{
            title: 'Inicio',
            headerShown: true
          }}
        />
        <Tab.Screen 
          name="Grafica" 
          component={Graphic}
          options={{
            title: 'Análisis',
            headerShown: true
          }}
        />
        <Tab.Screen 
          name="Ventas" 
          component={Sales}
          options={{
            title: 'Ventas',
            headerShown: true
          }}
        />
        <Tab.Screen 
          name="Ajustes" 
          component={Settings}
          options={{
            title: 'Configuración',
            headerShown: true
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Estilos adicionales que puedes usar en tus screens
  screenContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === 'ios' ? 85 : 65, // Espacio para la tab bar
  },
});