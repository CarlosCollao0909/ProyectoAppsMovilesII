// screens/Graphic.js - Pantalla de gráficas con ingresos por día
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

// Colores del tema
const colors = {
  primary: '#667eea',
  surface: '#f7fafc',
  text: '#1a202c',
  card: '#ffffff',
  shadow: '#000000',
};

const { width } = Dimensions.get('window');

export default function Graphic() {
  const [dailyIncome, setDailyIncome] = useState([]);
  const [totalWeekIncome, setTotalWeekIncome] = useState(0);
  const [averageDailyIncome, setAverageDailyIncome] = useState(0);
  const [bestDay, setBestDay] = useState('');

  useEffect(() => {
    loadGraphicData();
  }, []);

  const loadGraphicData = () => {
    // Simulando datos de los últimos 7 días
    const mockData = [
      { day: 'Lun', date: '18/06', income: 850.50, fullDay: 'Lunes' },
      { day: 'Mar', date: '19/06', income: 1200.75, fullDay: 'Martes' },
      { day: 'Mié', date: '20/06', income: 950.25, fullDay: 'Miércoles' },
      { day: 'Jue', date: '21/06', income: 1450.00, fullDay: 'Jueves' },
      { day: 'Vie', date: '22/06', income: 1680.50, fullDay: 'Viernes' },
      { day: 'Sáb', date: '23/06', income: 2100.25, fullDay: 'Sábado' },
      { day: 'Dom', date: '24/06', income: 1850.75, fullDay: 'Domingo' },
    ];

    setDailyIncome(mockData);

    // Calcular estadísticas
    const total = mockData.reduce((sum, day) => sum + day.income, 0);
    setTotalWeekIncome(total);
    setAverageDailyIncome(total / mockData.length);

    // Encontrar el mejor día
    const best = mockData.reduce((max, day) => 
      day.income > max.income ? day : max
    );
    setBestDay(best.fullDay);
  };

  const formatMoney = (amount) => {
    return `Bs. ${amount.toFixed(2)}`;
  };

  const getCurrentWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    
    return `${firstDay.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })} - ${lastDay.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}`;
  };

  // Configuración del gráfico
  const chartData = {
    labels: dailyIncome.map(item => item.day),
    datasets: [{
      data: dailyIncome.map(item => item.income)
    }]
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(26, 32, 44, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary
    },
    barPercentage: 0.6,
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.screenContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Análisis de Ventas</Text>
            <Text style={styles.headerSubtitle}>Semana: {getCurrentWeek()}</Text>
          </View>
          <View style={styles.chartIcon}>
            <Ionicons name="analytics" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Gráfico de Barras */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📊 Ingresos por Día</Text>
          <Text style={styles.chartSubtitle}>Últimos 7 días</Text>
          
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={width - 60} // padding horizontal
              height={300}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              fromZero={true}
              segments={4}
              showBarTops={false}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  screenContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 85 : 65,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
  },
  chartIcon: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  chartCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginHorizontal: -10,
  },
  chart: {
    borderRadius: 16,
  },
});