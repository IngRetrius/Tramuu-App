import { useState, useEffect, useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableCowCard from '@/components/management/SwipeableCowCard';
import { Funnel, Plus, Search, AlertCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { cowsService } from '@/services';

// Constants
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const STATUS_COLORS = {
  'Preñada': '#10B981',
  'Lactante': '#3B82F6',
  'Seca': '#F59E0B',
};

const LOW_PRODUCTION_THRESHOLD = 5; // Liters per day
const MILLISECONDS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date in ISO format
 * @returns {string} Age text (e.g., "2 años" or "N/A")
 */
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const ageInYears = Math.floor((today - birthDate) / MILLISECONDS_PER_YEAR);

  return `${ageInYears} año${ageInYears !== 1 ? 's' : ''}`;
};

/**
 * Map backend cow data to frontend format
 * @param {Object} cow - Raw cow data from backend
 * @returns {Object} Formatted cow data for display
 */
const mapCowData = (cow) => {
  const dailyProduction = cow.daily_production || 0;
  const status = cow.status || 'Activa';

  return {
    id: cow.id,
    cowId: cow.cow_id,
    name: cow.name,
    displayName: cow.name || cow.cow_id,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=150&h=150&fit=crop',
    status,
    breed: cow.breed || 'Holstein',
    production: `${dailyProduction}L`,
    age: calculateAge(cow.date_of_birth),
    alert: dailyProduction > 0 && dailyProduction < LOW_PRODUCTION_THRESHOLD,
    statusColor: STATUS_COLORS[status] || '#F59E0B',
    breedColor: '#E5E7EB'
  };
};

export default function Management() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [cowsData, setCowsData] = useState([]);

  /**
   * Load cows from backend with current filters
   */
  const loadCows = async () => {
    try {
      const data = await cowsService.getCows({
        search: searchText || undefined,
        breed: selectedBreed || undefined,
        status: selectedStatus || undefined,
      });

      // Map backend data to frontend format
      const cowsArray = data.cows || data || [];
      const mappedCows = cowsArray.map(mapCowData);

      setCowsData(mappedCows);
      setError(null);
    } catch (err) {
      console.error('Error loading cows:', err);
      setError(err.message);
      // Keep previous data on error to avoid empty screen
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load cows on mount and when search or filters change
  useEffect(() => {
    loadCows();
  }, [searchText, selectedBreed, selectedStatus]);

  /**
   * Reload cows when screen gains focus (e.g., after adding a new cow)
   */
  useFocusEffect(
    useCallback(() => {
      loadCows();
    }, [])
  );

  /**
   * Handle pull-to-refresh action
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadCows();
  };

  /**
   * Handle cow deletion
   * @param {string} cowId - ID of the cow to delete
   */
  const handleDeleteCow = async (cowId) => {
    try {
      // Show loading indicator
      setLoading(true);

      // Call backend to delete cow
      await cowsService.deleteCow(cowId);

      // Remove cow from local state immediately for better UX
      setCowsData(prevCows => prevCows.filter(cow => cow.id !== cowId));

      // Show success message
      Alert.alert(
        'Éxito',
        'La vaca ha sido eliminada correctamente',
        [{ text: 'OK' }]
      );

      // Reload cows to ensure sync with backend
      await loadCows();
    } catch (err) {
      console.error('Error deleting cow:', err);
      Alert.alert(
        'Error',
        'No se pudo eliminar la vaca. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
      // Reload cows to ensure data consistency
      await loadCows();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter button component for breed and status filters
   */
  const FilterButton = ({ title, isSelected, onPress, color }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected && { backgroundColor: color || '#E5E7EB' }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterButtonText,
        isSelected && { color: color === '#10B981' ? '#FFFFFF' : '#1F2937' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        {/* Decorative Background Elements */}
        <View style={styles.backgroundContainer}>
        <Svg
          style={styles.blob1}
          viewBox="0 0 220 652"
          width={screenWidth * 0.8}
          height={screenHeight * 0.4}
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M135.567 165.28C198.708 104.625 244.335 -2.03809 331.846 0.561042C417.299 3.09907 444.691 120.968 509.756 176.393C582.479 238.342 718.835 248.925 734.109 343.226C749.407 437.67 643.249 506.96 573.999 573.017C524.535 620.2 463.564 652.135 396.482 665.282C342.269 675.906 292.183 637.63 236.959 639.071C162.029 641.025 76.1528 725.34 20.5643 675.085C-34.0802 625.683 38.9803 533.96 39.2092 460.293C39.3821 404.674 4.4645 351.341 21.7349 298.465C40.3198 241.564 92.3933 206.754 135.567 165.28Z"
            fill="black"
          />
        </Svg>
        <Svg
          style={styles.blob2}
          viewBox="0 0 220 652"
          width={screenWidth * 0.8}
          height={screenHeight * 0.4}
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M135.567 165.28C198.708 104.625 244.335 -2.03809 331.846 0.561042C417.299 3.09907 444.691 120.968 509.756 176.393C582.479 238.342 718.835 248.925 734.109 343.226C749.407 437.67 643.249 506.96 573.999 573.017C524.535 620.2 463.564 652.135 396.482 665.282C342.269 675.906 292.183 637.63 236.959 639.071C162.029 641.025 76.1528 725.34 20.5643 675.085C-34.0802 625.683 38.9803 533.96 39.2092 460.293C39.3821 404.674 4.4645 351.341 21.7349 298.465C40.3198 241.564 92.3933 206.754 135.567 165.28Z"
            fill="black"
          />
        </Svg>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ID o nombre..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filtersButton}>
          <Funnel />
          <Text style={styles.filtersButtonText}>Filtros</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTags}>
          <FilterButton
            title="Holstein"
            isSelected={selectedBreed === 'Holstein'}
            onPress={() => setSelectedBreed(selectedBreed === 'Holstein' ? '' : 'Holstein')}
            color="#10B981"
          />
          <FilterButton
            title="Preñada"
            isSelected={selectedStatus === 'Preñada'}
            onPress={() => setSelectedStatus(selectedStatus === 'Preñada' ? '' : 'Preñada')}
            color="#F59E0B"
          />
        </ScrollView>
      </View>

      {/* Cows List */}
      <ScrollView
        style={styles.cowsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.loadingText}>Cargando vacas...</Text>
          </View>
        ) : error && !loading ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color="#EF4444" />
            <Text style={styles.errorText}>Error al cargar las vacas</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCows}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : cowsData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay vacas registradas</Text>
          </View>
        ) : (
          cowsData.map((cow) => (
            <SwipeableCowCard
              key={cow.id}
              cow={cow}
              onDelete={handleDeleteCow}
            />
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/cowForm')}
      >
        <Plus color="#FFFFFF" />
      </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  filtersButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  filterTags: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  cowsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    right: -100,
    top: 200,
    transform: [{ rotate: "-27.557deg" }, { scaleX: 1 }, { scaleY: 2 }],
  },
  blob2: {
    position: "absolute",
    left: -100,
    bottom: -150,
    transform: [{ rotate: "90deg" }, { scaleX: 1.3 }, { scaleY: 1.3 }],
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});