// screens/Sales.js - Pantalla de ventas con contadores
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseconfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

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
  border: '#e2e8f0',
  danger: '#e53e3e',
};

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(false);

  // Leer productos desde Firestore al iniciar
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productosFirestore = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productosFirestore);
        // Inicializar sales con 0 para todos los productos
        const initialSales = {};
        productosFirestore.forEach(product => {
          initialSales[product.id] = 0;
        });
        setSales(initialSales);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Calcular total cada vez que cambien las sales
    calculateTotal();
  }, [sales]);

  const calculateTotal = () => {
    let total = 0;
    products.forEach(product => {
      const quantity = sales[product.id] || 0;
      total += quantity * product.price;
    });
    setTotalIncome(total);
  };

  const updateQuantity = (productId, change) => {
    setSales(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      return {
        ...prev,
        [productId]: newQuantity
      };
    });
  };

  const resetSales = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás segura de que quieres resetear todas las ventas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetear', 
          style: 'destructive',
          onPress: () => {
            const resetSales = {};
            products.forEach(product => {
              resetSales[product.id] = 0;
            });
            setSales(resetSales);
          }
        }
      ]
    );
  };

  const saveSales = async () => {
    if (totalIncome === 0) {
      Alert.alert('Sin ventas', 'No hay ventas para guardar.');
      return;
    }
    try {
      // Obtener la fecha en zona horaria de Bolivia (GMT-4)
      const now = new Date();
      const boliviaOffset = -4 * 60; // minutos
      const localUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
      const boliviaDate = new Date(localUTC + boliviaOffset * 60000);
      // Construir fecha yyyy-mm-dd con valores locales de Bolivia
      const year = boliviaDate.getFullYear();
      const month = String(boliviaDate.getMonth() + 1).padStart(2, '0');
      const day = String(boliviaDate.getDate()).padStart(2, '0');
      const fecha = `${year}-${month}-${day}`;
      const productosVendidos = products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: sales[product.id] || 0
      })).filter(item => item.quantity > 0);
      await addDoc(collection(db, 'ventas'), {
        fecha,
        total: totalIncome,
        productos: productosVendidos,
        createdAt: boliviaDate
      });
      Alert.alert('Ventas Guardadas', `Se han guardado las ventas del día con un total de Bs. ${totalIncome.toFixed(2)}`);
      // Resetear ventas después de guardar
      const resetSales = {};
      products.forEach(product => {
        resetSales[product.id] = 0;
      });
      setSales(resetSales);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la venta.');
    }
  };

  const formatMoney = (amount) => {
    return `Bs. ${amount.toFixed(2)}`;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-BO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'pollo':
        return 'restaurant';
      case 'bebida':
        return 'wine';
      default:
        return 'cube';
    }
  };

  const renderProductItem = (product) => {
    const quantity = sales[product.id] || 0;
    const subtotal = quantity * product.price;

    return (
      <View key={product.id} style={styles.productItem}>
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <View style={styles.productNameContainer}>
              <Ionicons 
                name={getCategoryIcon(product.category)} 
                size={20} 
                color={colors.primary} 
                style={styles.productIcon}
              />
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Text style={styles.productPrice}>{formatMoney(product.price)}</Text>
          </View>
          
          {quantity > 0 && (
            <Text style={styles.subtotal}>
              Subtotal: {formatMoney(subtotal)}
            </Text>
          )}
        </View>

        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[styles.counterButton, styles.decreaseButton]}
            onPress={() => updateQuantity(product.id, -1)}
            disabled={quantity === 0}
          >
            <Ionicons 
              name="remove" 
              size={20} 
              color={quantity === 0 ? colors.border : colors.background} 
            />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>

          <TouchableOpacity
            style={[styles.counterButton, styles.increaseButton]}
            onPress={() => updateQuantity(product.id, 1)}
          >
            <Ionicons name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getTotalItems = () => {
    return Object.values(sales).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        {/* Header con fecha */}
        <View style={styles.headerCard}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Ventas del Día</Text>
            <Text style={styles.headerDate}>{getCurrentDate()}</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetSales}>
            <Ionicons name="refresh" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Lista de productos */}
        {loading ? (
          <View style={{ alignItems: 'center', marginVertical: 30 }}>
            <Ionicons name="hourglass" size={32} color={colors.primary} />
            <Text style={{ color: colors.text, marginTop: 10 }}>Cargando productos...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.productsContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>🍗 Productos de Pollo</Text>
            {products
              .filter(product => product.category === 'pollo')
              .map(product => renderProductItem(product))
            }

            <Text style={styles.sectionTitle}>🥤 Bebidas</Text>
            {products
              .filter(product => product.category === 'bebida')
              .map(product => renderProductItem(product))
            }
          </ScrollView>
        )}

        {/* Footer con total */}
        <View style={styles.footerContainer}>
          <View style={styles.totalContainer}>
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>Total del Día</Text>
              <Text style={styles.totalItems}>{getTotalItems()} productos</Text>
            </View>
            <Text style={styles.totalAmount}>{formatMoney(totalIncome)}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton, 
              totalIncome === 0 && styles.saveButtonDisabled
            ]}
            onPress={saveSales}
            disabled={totalIncome === 0}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={totalIncome === 0 ? colors.border : colors.background} 
            />
            <Text style={[
              styles.saveButtonText,
              totalIncome === 0 && styles.saveButtonTextDisabled
            ]}>
              Guardar Ventas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerCard: {
    backgroundColor: colors.card,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    textTransform: 'capitalize',
  },
  resetButton: {
    padding: 8,
  },
  productsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  productItem: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    marginRight: 15,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productIcon: {
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  subtotal: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButton: {
    backgroundColor: colors.border,
  },
  increaseButton: {
    backgroundColor: colors.primary,
  },
  quantityContainer: {
    minWidth: 40,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  footerContainer: {
    backgroundColor: colors.card,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  totalItems: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.surface,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginLeft: 8,
  },
  saveButtonTextDisabled: {
    color: colors.border,
  },
});