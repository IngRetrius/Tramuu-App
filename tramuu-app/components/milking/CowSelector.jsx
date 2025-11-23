/**
 * Cow Selector Component
 * Componente reutilizable para seleccionar vacas en registros de ordeño
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Check, X } from 'lucide-react-native';
import { cowsService } from '@/services';

const { width: screenWidth } = Dimensions.get('window');

export default function CowSelector({ visible, onClose, onSelect, selectedCows = [], multiSelect = false }) {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState(selectedCows);

  useEffect(() => {
    if (visible) {
      console.log('🔵 CowSelector Modal abierto');
      setSelected(selectedCows);
      loadCows();
    } else {
      // Reset search when modal closes
      setSearchText('');
    }
  }, [visible]);

  const loadCows = async () => {
    try {
      setLoading(true);
      const data = await cowsService.getCows({ search: searchText });
      const cowsList = data.cows || data || [];
      console.log('📋 CowSelector - Vacas cargadas:', cowsList.length);
      console.log('📋 CowSelector - Datos:', cowsList.slice(0, 2)); // Log primeras 2 vacas
      setCows(cowsList);
    } catch (error) {
      console.error('❌ Error loading cows:', error);
      setCows([]); // Asegurar que cows sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const toggleCowSelection = (cow) => {
    if (multiSelect) {
      const isSelected = selected.some(c => c.id === cow.id);
      if (isSelected) {
        setSelected(selected.filter(c => c.id !== cow.id));
      } else {
        setSelected([...selected, cow]);
      }
    } else {
      setSelected([cow]);
    }
  };

  const handleConfirm = () => {
    onSelect(multiSelect ? selected : selected[0]);
    onClose();
  };

  const isSelected = (cowId) => {
    return selected.some(c => c.id === cowId);
  };

  const CowItem = ({ cow }) => {
    const selected = isSelected(cow.id);

    return (
      <TouchableOpacity
        style={[styles.cowItem, selected && styles.cowItemSelected]}
        onPress={() => toggleCowSelection(cow)}
      >
        <View style={styles.cowInfo}>
          <Text style={styles.cowId}>
            {cow.cow_id || cow.id}{cow.name ? ` - ${cow.name}` : ''}
          </Text>
          <Text style={styles.cowBreed}>{cow.breed}</Text>
        </View>
        {selected && (
          <View style={styles.checkIcon}>
            <Check size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Seleccionar {multiSelect ? 'Vacas' : 'Vaca'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por ID o raza..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={loadCows}
              returnKeyType="search"
            />
          </View>

          {/* Selected Count */}
          {multiSelect && selected.length > 0 && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>
                {selected.length} {selected.length === 1 ? 'vaca seleccionada' : 'vacas seleccionadas'}
              </Text>
            </View>
          )}

          {/* Cows List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.loadingText}>Cargando vacas...</Text>
            </View>
          ) : (
            <>
              {cows.length > 0 && (
                <Text style={styles.countText}>
                  {cows.length} {cows.length === 1 ? 'vaca disponible' : 'vacas disponibles'}
                </Text>
              )}
              <FlatList
                data={cows}
                keyExtractor={(item, index) => item.id?.toString() || `cow-${index}`}
                renderItem={({ item }) => <CowItem cow={item} />}
                style={styles.list}
                contentContainerStyle={[
                  styles.listContent,
                  cows.length === 0 && { flex: 1, justifyContent: 'center' }
                ]}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No se encontraron vacas</Text>
                    <Text style={styles.emptySubtext}>
                      Intenta agregar vacas desde la sección de Gestión
                    </Text>
                  </View>
                )}
              />
            </>
          )}

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, selected.length === 0 && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={selected.length === 0}
          >
            <Text style={styles.confirmButtonText}>
              Confirmar Selección
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '50%',
    paddingTop: 20,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  selectedBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  list: {
    flex: 1,
    flexGrow: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  cowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cowItemSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#60A5FA',
  },
  cowInfo: {
    flex: 1,
  },
  cowId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cowBreed: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  confirmButton: {
    backgroundColor: '#60A5FA',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
