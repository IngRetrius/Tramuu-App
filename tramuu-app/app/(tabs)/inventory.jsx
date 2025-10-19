import {
  Calendar,
  ChevronDown,
  Clock,
  Package,
  Thermometer,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { inventoryService } from '@/services';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('estado'); // estado, movimientos, vencimientos
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [movements, setMovements] = useState([]);

  // Load data on mount and when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'estado') {
        await Promise.all([loadItems(), loadStatistics()]);
      } else if (activeTab === 'movimientos') {
        await loadMovements();
      }
    } catch (err) {
      console.error('Error loading inventory data:', err);
      setError(err.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const data = await inventoryService.getItems();
      setItems(data || []);
    } catch (error) {
      throw error;
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await inventoryService.getStatistics();
      setStatistics(data || null);
    } catch (error) {
      throw error;
    }
  };

  const loadMovements = async () => {
    try {
      // Get movements for all items
      const allMovements = [];
      for (const item of items) {
        const itemMovements = await inventoryService.getMovements(item.id);
        allMovements.push(...(itemMovements || []));
      }
      setMovements(allMovements);
    } catch (error) {
      throw error;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'COLD':
        return '#10B981';
      case 'HOT':
        return '#EF4444';
      case 'PROCESS':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COLD':
        return 'Frío';
      case 'HOT':
        return 'Caliente';
      case 'PROCESS':
        return 'Proceso';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'FRESH_MILK':
        return 'Leche Fresca';
      case 'PROCESSING':
        return 'En Proceso';
      case 'STORED':
        return 'Almacenada';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'FRESH_MILK':
        return '#3B82F6';
      case 'PROCESSING':
        return '#F59E0B';
      case 'STORED':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate capacity data from statistics
  const capacityData = statistics ? {
    total: statistics.totalQuantity || 0,
    frios: statistics.coldQuantity || 0,
    calientes: statistics.hotQuantity || 0
  } : { total: 0, frios: 0, calientes: 0 };

  // Calculate categories data from statistics
  const categoriesData = statistics ? [
    {
      name: 'Leche Fresca',
      cantidad: `${(statistics.freshMilk || 0).toLocaleString()} L`,
      percentage: statistics.totalQuantity > 0 ? ((statistics.freshMilk || 0) / statistics.totalQuantity * 100).toFixed(1) : 0,
      color: '#3B82F6'
    },
    {
      name: 'En Proceso',
      cantidad: `${(statistics.processing || 0).toLocaleString()} L`,
      percentage: statistics.totalQuantity > 0 ? ((statistics.processing || 0) / statistics.totalQuantity * 100).toFixed(1) : 0,
      color: '#F59E0B'
    },
    {
      name: 'Almacenada',
      cantidad: `${(statistics.stored || 0).toLocaleString()} L`,
      percentage: statistics.totalQuantity > 0 ? ((statistics.stored || 0) / statistics.totalQuantity * 100).toFixed(1) : 0,
      color: '#10B981'
    }
  ] : [];

  // Transform items to lotes format
  const lotesActivos = items.slice(0, 3).map(item => ({
    id: item.batchId,
    cantidad: `${item.quantity.toLocaleString()} L`,
    ingreso: formatDate(item.createdAt),
    diasAtras: getDaysAgo(item.createdAt),
    estado: getStatusLabel(item.status),
    estadoColor: getStatusColor(item.status),
    location: item.location
  }));

  const Tab = ({ id, title, icon: Icon, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.tab, isSelected && styles.tabSelected]}
      onPress={onPress}
    >
      <View style={styles.tabContent}>
        {Icon && <Icon size={16} color={isSelected ? '#3B82F6' : '#6B7280'} />}
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {title}
        </Text>
      </View>
      {isSelected && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, unit, color, icon: Icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        {Icon && <Icon size={20} color={color} />}
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  );

  const LoteCard = ({ lote }) => (
    <View style={styles.loteCard}>
      <View style={styles.loteHeader}>
        <View>
          <Text style={styles.loteTitle}>Lote</Text>
          <Text style={styles.loteId}>{lote.id}</Text>
          <Text style={styles.loteCantidad}>Cantidad: {lote.cantidad}</Text>
        </View>
        <View style={styles.loteRight}>
          <View style={[styles.estadoBadge, { backgroundColor: lote.estadoColor }]}>
            <Text style={styles.estadoText}>{lote.estado}</Text>
          </View>
          <View style={styles.loteInfo}>
            <Text style={styles.ingresoLabel}>Ingreso:</Text>
            <Text style={styles.ingresoDate}>{lote.ingreso}</Text>
          </View>
        </View>
      </View>
      <View style={styles.loteFooter}>
        <View style={styles.timeInfo}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.timeText}>Hace {lote.diasAtras} días</Text>
        </View>
      </View>
    </View>
  );

  const CategoryBar = ({ category }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
      </View>
      <View style={styles.categoryBar}>
        <View 
          style={[
            styles.categoryProgress, 
            { 
              backgroundColor: category.color, 
              width: `${category.percentage}%` 
            }
          ]} 
        />
      </View>
      <Text style={styles.categoryCantidad}>{category.cantidad}</Text>
    </View>
  );

  const renderEstadoBodega = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando inventario...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error al cargar inventario</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <RefreshCw size={20} color="#3B82F6" />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!items || items.length === 0) {
      return (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
          }
        >
          <Package size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay items en inventario</Text>
          <Text style={styles.emptyText}>Los lotes de leche aparecerán aquí cuando los agregues</Text>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
      >
        {/* Capacity Stats */}
        <View style={styles.capacitySection}>
        <Text style={styles.sectionTitle}>Capacidad Total</Text>
        <View style={styles.statsContainer}>
          <StatCard
            label="Litros Fríos"
            value={capacityData.frios.toLocaleString()}
            unit="Litros"
            color="#3B82F6"
            icon={Thermometer}
          />
          <StatCard
            label="Litros Calientes"
            value={capacityData.calientes.toLocaleString()}
            unit="Litros"
            color="#EF4444"
            icon={TrendingUp}
          />
        </View>
      </View>

      {/* Stock por Categoría */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stock por Categoría</Text>
        <View style={styles.categoriesContainer}>
          {categoriesData.map((category, index) => (
            <CategoryBar key={index} category={category} />
          ))}
        </View>
      </View>

      {/* Lotes Activos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Lotes Activos</Text>
          <Text style={styles.lotesCount}>{lotesActivos.length} lotes</Text>
        </View>
        
        <View style={styles.lotesContainer}>
          {lotesActivos.map((lote, index) => (
            <LoteCard key={index} lote={lote} />
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todos los lotes</Text>
          <ChevronDown size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
    );
  };

  const renderMovimientos = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando movimientos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error al cargar movimientos</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <RefreshCw size={20} color="#3B82F6" />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!movements || movements.length === 0) {
      return (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
          }
        >
          <TrendingUp size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay movimientos</Text>
          <Text style={styles.emptyText}>Los movimientos de entrada y salida aparecerán aquí</Text>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Historial de Movimientos</Text>
          <View style={styles.movementsContainer}>
            {movements.map((movement, index) => (
              <View key={index} style={styles.movementCard}>
                <View style={styles.movementHeader}>
                  <View style={[
                    styles.movementTypeBadge,
                    { backgroundColor: movement.type === 'IN' ? '#10B981' : movement.type === 'OUT' ? '#EF4444' : '#F59E0B' }
                  ]}>
                    <Text style={styles.movementTypeText}>
                      {movement.type === 'IN' ? 'Entrada' : movement.type === 'OUT' ? 'Salida' : 'Ajuste'}
                    </Text>
                  </View>
                  <Text style={styles.movementQuantity}>{movement.quantity.toLocaleString()} L</Text>
                </View>
                {movement.reason && (
                  <Text style={styles.movementReason}>{movement.reason}</Text>
                )}
                <Text style={styles.movementDate}>
                  {formatDate(movement.createdAt)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderVencimientos = () => (
    <View style={styles.emptyState}>
      <Calendar size={48} color="#F59E0B" />
      <Text style={styles.emptyTitle}>Próximos Vencimientos</Text>
      <Text style={styles.emptyText}>No hay productos próximos a vencer</Text>
    </View>
  );

  return (
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tab
          id="estado"
          title="Estado Bodega"
          icon={Package}
          isSelected={activeTab === 'estado'}
          onPress={() => setActiveTab('estado')}
        />
        <Tab
          id="movimientos"
          title="Movimientos"
          icon={TrendingUp}
          isSelected={activeTab === 'movimientos'}
          onPress={() => setActiveTab('movimientos')}
        />
        <Tab
          id="vencimientos"
          title="Vencimientos"
          icon={Calendar}
          isSelected={activeTab === 'vencimientos'}
          onPress={() => setActiveTab('vencimientos')}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'estado' && renderEstadoBodega()}
        {activeTab === 'movimientos' && renderMovimientos()}
        {activeTab === 'vencimientos' && renderVencimientos()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    top: -100,
    transform: [{ rotate: "-40deg" }, { scaleX: 2.4 }, { scaleY: 2 }],
  },
  blob2: {
    position: "absolute",
    left: -100,
    bottom: -100,
    transform: [{ rotate: "90deg" }, { scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  tab: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  tabTextSelected: {
    color: '#3B82F6',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3B82F6',
  },
  content: {
    flex: 1,
    zIndex: 5,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  capacitySection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  lotesCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
  },
  categoryProgress: {
    height: '100%',
    borderRadius: 3,
  },
  categoryCantidad: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  lotesContainer: {
    gap: 12,
  },
  loteCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loteTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  loteId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  loteCantidad: {
    fontSize: 14,
    color: '#374151',
  },
  loteRight: {
    alignItems: 'flex-end',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  loteInfo: {
    alignItems: 'flex-end',
  },
  ingresoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  ingresoDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  loteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  movementsContainer: {
    gap: 12,
  },
  movementCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  movementTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  movementQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  movementReason: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  movementDate: {
    fontSize: 12,
    color: '#6B7280',
  },
});