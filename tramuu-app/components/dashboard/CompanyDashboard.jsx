import {
  AlertTriangle,
  Clock,
  Droplet,
  Star,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { dashboardService } from '@/services';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CompanyDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Semana');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [chartTitle, setChartTitle] = useState('Producción Semanal');
  const [chartLoading, setChartLoading] = useState(false);

  // Datos del dashboard (con valores por defecto)
  const [dashboardData, setDashboardData] = useState({
    produccionHoy: {
      value: '0L',
      change: '+0% vs ayer',
      isPositive: true
    },
    calidadPromedio: {
      value: '0%',
      label: 'Cargando...',
      isPositive: true
    },
    entregasHoy: {
      value: '0',
      pendientes: '0 pendientes'
    },
    lecherosActivos: {
      value: '0',
      total: 'de 0 total'
    }
  });

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getSummary();
      console.log('Dashboard data received:', data);

      // Map backend data to frontend format
      setDashboardData({
        produccionHoy: {
          value: `${data.today?.totalLiters || 0}L`,
          change: `${data.today?.milkingsAM || 0} AM / ${data.today?.milkingsPM || 0} PM`,
          isPositive: true
        },
        calidadPromedio: {
          value: `${data.today?.avgPerCow || 0}L`,
          label: 'Por vaca',
          isPositive: true
        },
        entregasHoy: {
          value: String(data.thisWeek?.totalLiters || 0),
          pendientes: 'Esta semana'
        },
        lecherosActivos: {
          value: String(data.today?.activeCows || 0),
          total: `vacas activas`
        }
      });

      // Update top cows if available
      if (data.topProducers && data.topProducers.length > 0) {
        const formattedCows = data.topProducers.map(cow => ({
          id: cow.id,
          name: cow.name || cow.cow_id || 'Sin nombre',
          breed: 'Holstein', // Default breed
          production: `${cow.daily_production || 0}L`,
          change: '+0%',
          isPositive: true
        }));
        setTopCows(formattedCows);
      }

      // Update chart data with REAL weekly production data
      if (data.thisWeek && data.thisWeek.dailyProduction) {
        const dailyData = data.thisWeek.dailyProduction;

        // Extract labels (day names) and values (total liters)
        const labels = dailyData.map(day => day.dayName);
        const values = dailyData.map(day => day.totalLiters);

        // Ensure all values are at least 1 (to avoid chart rendering issues)
        const safeChartValues = values.map(val => Math.max(val, 1));

        console.log('Chart data (REAL):', {
          labels,
          values: safeChartValues,
          rawData: dailyData
        });

        setChartData({
          labels,
          datasets: [
            {
              data: safeChartValues,
              strokeWidth: 3,
              color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
            }
          ]
        });
      } else {
        // Fallback: use dummy data if dailyProduction is not available
        console.warn('No dailyProduction data available, using fallback');
        setChartData({
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              data: [1, 1, 1, 1, 1, 1, 1],
              strokeWidth: 3,
              color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
            }
          ]
        });
      }

      setError(null);

      // Load initial production data by period
      loadProductionByPeriod(selectedPeriod);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
      // Keep default/previous values on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load production data by period
  const loadProductionByPeriod = async (period) => {
    try {
      console.log(`Loading production data for period: ${period}`);

      // Show loading state for chart
      setChartLoading(true);

      // Map Spanish period names to English for API
      const periodMap = {
        'Día': 'day',
        'Semana': 'week',
        'Mes': 'month'
      };

      const apiPeriod = periodMap[period] || 'week';
      const response = await dashboardService.getProductionByPeriod(apiPeriod);

      console.log('Production data received:', response);

      // Extract data from nested structure
      const data = response.data || response;

      console.log('Extracted data:', data);
      console.log('Labels:', data.labels);
      console.log('DataPoints:', data.dataPoints);

      // Update chart title
      const titleMap = {
        'Día': 'Producción de Hoy',
        'Semana': 'Producción Semanal',
        'Mes': 'Producción Mensual'
      };
      setChartTitle(titleMap[period] || 'Producción');

      // Update chart data
      if (data.labels && data.dataPoints && Array.isArray(data.labels) && Array.isArray(data.dataPoints)) {
        const values = data.dataPoints.map(d => Math.max(d.totalLiters || 0, 1)); // Ensure minimum 1 to avoid chart issues

        console.log('Chart values:', values);
        console.log('Chart labels:', data.labels);

        // Create a completely new object to force React to re-render
        const newChartData = {
          labels: [...data.labels], // Create new array
          datasets: [
            {
              data: [...values], // Create new array
              strokeWidth: 3,
              color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
            }
          ],
          // Add a timestamp to ensure the object is different
          _timestamp: Date.now()
        };

        console.log('New chart data:', newChartData);

        // Small delay to ensure unmount/remount
        setTimeout(() => {
          setChartData(newChartData);
          setChartLoading(false);
          console.log('Chart data updated successfully');
        }, 100);
      } else {
        console.warn('No labels or dataPoints found in response', {
          hasLabels: !!data.labels,
          hasDataPoints: !!data.dataPoints,
          labelsIsArray: Array.isArray(data.labels),
          dataPointsIsArray: Array.isArray(data.dataPoints)
        });
        setChartLoading(false);
      }
    } catch (err) {
      console.error('Error loading production by period:', err);
      setChartLoading(false);
      // Don't show error alert for period changes, just log it
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Reload production data when period changes
  useEffect(() => {
    if (!loading) {
      loadProductionByPeriod(selectedPeriod);
    }
  }, [selectedPeriod]);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Datos para el gráfico (solo con datos reales del backend)
  const [chartData, setChartData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
      }
    ]
  });

  // Top 5 vacas productoras (vacío por defecto, se llena con datos del backend)
  const [topCows, setTopCows] = useState([]);

  // Alertas críticas (vacío por defecto, se llena con datos del backend)
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  // Inventario de bodega (vacío por defecto, se llena con datos del backend)
  const [inventory, setInventory] = useState([]);

  const MetricCard = ({ title, value, subtitle, icon: Icon, isPositive }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={[styles.metricIconContainer]}>
          <Icon size={25} color="#000" />
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.metricSubtitle}>
        {isPositive !== undefined && (
          <View style={styles.changeContainer}>
            {isPositive ? (
              <TrendingUp size={12} color="#10B981" />
            ) : (
              <TrendingDown size={12} color="#EF4444" />
            )}
          </View>
        )}
        <Text style={[
          styles.metricSubtitleText,
          isPositive === true && styles.positiveChange,
          isPositive === false && styles.negativeChange
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );

  const PeriodButton = ({ period, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.periodButton, isSelected && styles.periodButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.periodButtonText, isSelected && styles.periodButtonTextSelected]}>
        {period}
      </Text>
    </TouchableOpacity>
  );

  const CowRankingItem = ({ cow, index }) => (
    <View style={styles.cowItem}>
      <View style={styles.cowRank}>
        <Text style={styles.cowRankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.cowInfo}>
        <Text style={styles.cowName}>{cow.name}</Text>
        <Text style={styles.cowBreed}>{cow.breed}</Text>
      </View>
      <View style={styles.cowProduction}>
        <Text style={styles.cowProductionValue}>{cow.production}</Text>
        <View style={styles.cowChange}>
          {cow.isPositive ? (
            <TrendingUp size={12} color="#10B981" />
          ) : (
            <TrendingDown size={12} color="#EF4444" />
          )}
          <Text style={[
            styles.cowChangeText,
            cow.isPositive ? styles.positiveChange : styles.negativeChange
          ]}>
            {cow.change}
          </Text>
        </View>
      </View>
    </View>
  );

  const AlertItem = ({ alert }) => (
    <View style={styles.alertItem}>
      <View style={[styles.alertIcon]}>
        <alert.icon size={25} color="#000" />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertDescription}>{alert.description}</Text>
      </View>
    </View>
  );

  const InventoryItem = ({ item }) => (
    <View style={styles.inventoryItem}>
      <View style={styles.inventoryIcon}>
        <item.icon size={25} color="#000" />
      </View>
      <View style={styles.inventoryInfo}>
        <Text style={styles.inventoryName}>{item.name}</Text>
        <View style={styles.inventoryProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>
      </View>
      <Text style={styles.inventoryAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Decorative Background Elements */}
      <View style={styles.backgroundContainer}>
        <Svg
          style={[styles.blob]}
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

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topSpacing} />

        {/* Loading State */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : null}

        {/* Error State */}
        {error && !loading ? (
          <View style={styles.errorContainer}>
            <AlertTriangle size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Error al cargar datos</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Métricas principales */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Producción Hoy"
            value={dashboardData.produccionHoy.value}
            subtitle={dashboardData.produccionHoy.change}
            icon={Droplet}
            color="#60A5FA"
            isPositive={dashboardData.produccionHoy.isPositive}
          />
          <MetricCard
            title="Promedio por Vaca"
            value={dashboardData.calidadPromedio.value}
            subtitle={dashboardData.calidadPromedio.label}
            icon={Star}
            color="#60A5FA"
            isPositive={true}
          />
          <MetricCard
            title="Producción Semanal"
            value={`${dashboardData.entregasHoy.value}L`}
            subtitle={dashboardData.entregasHoy.pendientes}
            icon={Truck}
            color="#60A5FA"
          />
          <MetricCard
            title="Vacas Activas"
            value={dashboardData.lecherosActivos.value}
            subtitle={dashboardData.lecherosActivos.total}
            icon={Users}
            color="#60A5FA"
          />
        </View>

        {/* Gráfico de Producción */}
        {!loading && chartData.datasets[0].data.length > 0 && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{chartTitle}</Text>
              <View style={styles.periodSelector}>
                {['Día', 'Semana', 'Mes'].map((period) => (
                  <PeriodButton
                    key={period}
                    period={period}
                    isSelected={selectedPeriod === period}
                    onPress={() => setSelectedPeriod(period)}
                  />
                ))}
              </View>
            </View>
            {chartLoading ? (
              <View style={styles.chartLoadingContainer}>
                <ActivityIndicator size="small" color="#60A5FA" />
                <Text style={styles.chartLoadingText}>Actualizando gráfico...</Text>
              </View>
            ) : (
              <LineChart
                key={`chart-${selectedPeriod}-${chartData._timestamp || Date.now()}`}
                data={chartData}
                width={screenWidth - 60}
                height={200}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#60A5FA'
                  }
                }}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={false}
                withHorizontalLines={true}
                withVerticalLines={false}
                withShadow={false}
                onDataPointClick={() => {}} // Disable double-click events
              />
            )}
          </View>
        )}

        {/* Top 5 Vacas Productoras */}
        {topCows.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top 5 Vacas Productoras</Text>
            <View style={styles.cowsList}>
              {topCows.map((cow, index) => (
                <CowRankingItem key={cow.id} cow={cow} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* Alertas Críticas */}
        {criticalAlerts.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Alertas Críticas</Text>
            <View style={styles.alertsList}>
              {criticalAlerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </View>
          </View>
        )}

        {/* Inventario Bodega */}
        {inventory.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inventario Bodega</Text>
            <View style={styles.inventoryList}>
              {inventory.map((item) => (
                <InventoryItem key={item.id} item={item} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  blob: {
    position: "absolute",
    right: -100,
    top: 200,
    transform: [{ rotate: "-27.557deg" }, { scaleX: 2.5 }, { scaleY: 2 }],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeContainer: {
    marginRight: 4,
  },
  metricSubtitleText: {
    fontSize: 12,
    color: '#6B7280',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonSelected: {
    backgroundColor: '#60A5FA',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodButtonTextSelected: {
    color: '#FFFFFF',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  chartLoadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  chartLoadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cowsList: {
    gap: 12,
  },
  cowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  cowRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cowRankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cowInfo: {
    flex: 1,
  },
  cowName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cowBreed: {
    fontSize: 12,
    color: '#6B7280',
  },
  cowProduction: {
    alignItems: 'flex-end',
  },
  cowProductionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  cowChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cowChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#60A5FA',
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  inventoryList: {
    gap: 12,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  inventoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  inventoryProgress: {
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 2,
  },
  inventoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  bottomSpacing: {
    height: 20,
  },
  topSpacing: {
    height: 20,
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
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
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
});
