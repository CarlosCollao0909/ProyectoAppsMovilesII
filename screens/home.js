// screens/Home.js - Pantalla de inicio con ingresos del día anterior
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Colores del tema
const colors = {
  primary: '#667eea',
  secondary: '#ff8c00',
  background: '#ffffff',
  surface: '#f7fafc',
  text: '#1a202c',
  success: '#38a169',
  card: '#ffffff',
  shadow: '#000000',
};

export default function Home() {
  const [yesterdayIncome, setYesterdayIncome] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);
  const [bestProduct, setBestProduct] = useState('');
  const [totalSalesYesterday, setTotalSalesYesterday] = useState(0);

  useEffect(() => {
    // Aquí cargarías los datos reales desde tu base de datos o AsyncStorage
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Simulando datos - aquí conectarías con tu sistema de almacenamiento
    setYesterdayIncome(1250.50);
    setTodayIncome(890.75);
    setBestProduct('Pollo Entero');
    setTotalSalesYesterday(45); // cantidad de productos vendidos
  };

  const formatMoney = (amount) => {
    return `Bs. ${amount.toFixed(2)}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return {
      today: today.toLocaleDateString('es-BO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      yesterday: yesterday.toLocaleDateString('es-BO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const dates = getCurrentDate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const getComparisonWithPrevious = () => {
    const difference = todayIncome - (yesterdayIncome * 0.7); // Comparación estimada
    const isPositive = difference > 0;
    return {
      isPositive,
      percentage: Math.abs((difference / yesterdayIncome) * 100).toFixed(1),
      amount: Math.abs(difference)
    };
  };

  const comparison = getComparisonWithPrevious();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.screenContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Bienvenida */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.welcomeTitle}>{getGreeting()}</Text>
              <Text style={styles.welcomeSubtitle}>Resumen de tu pollería</Text>
            </View>
            <View style={styles.logoContainer}>
              <Ionicons name="restaurant" size={40} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.dateText}>{dates.today}</Text>
        </View>

        {/* Estadísticas Principales */}
        <View style={styles.statsContainer}>
          {/* Ingresos de Ayer */}
          <View style={[styles.statCard, styles.primaryCard]}>
            <View style={styles.statHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color={colors.background} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statTitlePrimary}>Ingresos de Ayer</Text>
                <Text style={styles.statSubtitlePrimary}>{dates.yesterday}</Text>
              </View>
            </View>
            <Text style={styles.incomeAmountPrimary}>{formatMoney(yesterdayIncome)}</Text>
            <Text style={styles.salesCountPrimary}>
              {totalSalesYesterday} productos vendidos
            </Text>
          </View>

        </View>

        
        {/* Recordatorio */}
        <View style={styles.reminderCard}>
          <Ionicons name="bulb" size={24} color={colors.primary} />
          <View style={styles.reminderText}>
            <Text style={styles.reminderTitle}>💡 Recordatorio</Text>
            <Text style={styles.reminderSubtitle}>
              No olvides registrar todas las ventas del día para mantener un control preciso.
            </Text>
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
  welcomeCard: {
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
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  logoContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    textTransform: 'capitalize',
    fontStyle: 'italic',
  },
  statsContainer: {
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statTitlePrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  statSubtitlePrimary: {
    fontSize: 13,
    color: colors.background,
    opacity: 0.8,
  },
  incomeAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  incomeAmountPrimary: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 5,
  },
  salesCountPrimary: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.8,
  },
  comparisonPositive: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  comparisonNegative: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  quickActions: {
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
  },
  reminderCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  reminderText: {
    flex: 1,
    marginLeft: 15,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  reminderSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    lineHeight: 20,
  },
});