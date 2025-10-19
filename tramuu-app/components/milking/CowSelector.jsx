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
  Dimensions
} from 'react-native';
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
      loadCows();
      setSelected(selectedCows);
    }
  }, [visible]);

  const loadCows = async () => {
    try {
      setLoading(true);
      const data = await cowsService.getCows({ search: searchText });
      setCows(data.cows || data || []);
    } catch (error) {
      console.error('Error loading cows:', error);
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
          <Text style={styles.cowId}>{cow.tag || cow.id}</Text>
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
            </View>
          ) : (
            <FlatList
              data={cows}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CowItem cow={item} />}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron vacas</Text>
                </View>
              )}
            />
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
    paddingTop: 20,
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
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
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
