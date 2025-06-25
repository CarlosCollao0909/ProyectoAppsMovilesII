// screens/Home.js - Pantalla de inicio con ingresos del día anterior
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Colores del tema
const colors = {
  primary: '#667eea',
  background: '#ffffff',
  surface: '#f7fafc',
  text: '#1a202c',
  card: '#ffffff',
  shadow: '#000000',
};

export default function Home() {
  const [yesterdayIncome, setYesterdayIncome] = useState(0);
  const [totalSalesYesterday, setTotalSalesYesterday] = useState(0);

  useEffect(() => {
    // Aquí cargarías los datos reales desde tu base de datos o AsyncStorage
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Simulando datos - aquí conectarías con tu sistema de almacenamiento
    setYesterdayIncome(1250.50);
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
  statTitlePrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 2,
  },
  statSubtitlePrimary: {
    fontSize: 13,
    color: colors.background,
    opacity: 0.8,
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