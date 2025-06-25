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
import { db } from '../firebaseconfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGraphicData();
  }, []);

  const loadGraphicData = async () => {
    setLoading(true);
    try {
      // Traer las últimas 7 ventas ordenadas por fecha descendente
      const ventasQuery = query(collection(db, 'ventas'), orderBy('fecha', 'desc'), limit(14));
      const querySnapshot = await getDocs(ventasQuery);
      const ventas = querySnapshot.docs.map(doc => doc.data());
      // Agrupar por fecha sumando los totales
      const agrupadas = {};
      ventas.forEach(v => {
        if (!agrupadas[v.fecha]) {
          agrupadas[v.fecha] = 0;
        }
        agrupadas[v.fecha] += v.total;
      });
      // Convertir a array y ordenar por fecha ascendente
      const fechas = Object.keys(agrupadas).sort();
      // Tomar solo las últimas 7 fechas
      const ultimasFechas = fechas.slice(-7);
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const diasSemanaLargos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const daily = ultimasFechas.map(f => {
        const dateObj = new Date(f + 'T00:00:00-04:00');
        const dayIdx = dateObj.getDay();
        return {
          day: diasSemana[dayIdx],
          date: f.slice(8,10) + '/' + f.slice(5,7),
          income: agrupadas[f],
          fullDay: diasSemanaLargos[dayIdx]
        };
      });
      setDailyIncome(daily);
      // Calcular estadísticas
      const total = daily.reduce((sum, day) => sum + day.income, 0);
      setTotalWeekIncome(total);
      setAverageDailyIncome(daily.length ? total / daily.length : 0);
      // Mejor día
      if (daily.length > 0) {
        const best = daily.reduce((max, day) => day.income > max.income ? day : max);
        setBestDay(best.fullDay);
      }
    } catch (e) {
      setDailyIncome([]);
    } finally {
      setLoading(false);
    }
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
          {loading ? (
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <Ionicons name="hourglass" size={32} color={colors.primary} />
              <Text style={{ color: colors.text, marginTop: 10 }}>Cargando datos...</Text>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <BarChart
                data={chartData}
                width={width - 60}
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
          )}
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