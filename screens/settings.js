import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Colores del tema (siguiendo el estilo de las otras pantallas)
const colors = {
  primary: '#667eea',
  surface: '#f7fafc',
  text: '#1a202c',
  card: '#ffffff',
  shadow: '#000000',
};

const categories = [
  { label: 'Pollo', value: 'pollo' },
  { label: 'Bebida', value: 'bebida' },
];

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0].value);
  const [error, setError] = useState('');

  const handleAddProduct = () => {
    if (!name.trim() || !price.trim() || isNaN(Number(price))) {
      setError('Completa todos los campos correctamente');
      return;
    }
    setProducts([
      ...products,
      { name: name.trim(), price: parseFloat(price), category }
    ]);
    setName('');
    setPrice('');
    setCategory(categories[0].value);
    setError('');
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <Text style={styles.headerSubtitle}>Registrar nuevo producto</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="settings" size={32} color={colors.primary} />
        </View>
      </View>

      {/* Formulario */}
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>Nombre del producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pollo Entero / Coca Cola"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.text + '55'}
        />
        <Text style={styles.formLabel}>Precio (Bs.)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 85.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor={colors.text + '55'}
        />
        <Text style={styles.formLabel}>Categoría</Text>
        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.categoryButton, category === cat.value && styles.categoryButtonActive]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
          <Ionicons name="add-circle" size={22} color={colors.card} />
          <Text style={styles.saveButtonText}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos registrados */}
      {products.length > 0 && (
        <View style={styles.productsListCard}>
          <Text style={styles.productsListTitle}>Productos registrados</Text>
          {products.map((prod, idx) => (
            <View key={idx} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{prod.name}</Text>
                <Text style={styles.productCategory}>{prod.category === 'pollo' ? 'Pollo' : 'Bebida'}</Text>
              </View>
              <Text style={styles.productPrice}>Bs. {prod.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.surface,
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
  iconContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  formCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.shadow + '10',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.card,
  },
  errorText: {
    color: '#e53e3e',
    marginBottom: 10,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  productsListCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  productCategory: {
    fontSize: 13,
    color: colors.primary,
    opacity: 0.7,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 10,
  },
});