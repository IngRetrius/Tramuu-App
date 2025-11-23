import { dashboardService } from "@/services";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { Blocks, ChartLine, Droplet, User } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    totalMilkings: 0,
    totalLiters: 0,
    averagePerMilking: 0,
  });

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    try {
      setError(null);
      const data = await dashboardService.getEmployeeSummary();
      
      console.log('Employee dashboard data received:', data);

      // Calculate statistics
      const totalMilkings = (data.today?.milkingsAM || 0) + (data.today?.milkingsPM || 0);
      const totalLiters = data.today?.totalLiters || 0;
      const averagePerMilking = totalMilkings > 0 ? (totalLiters / totalMilkings).toFixed(1) : 0;

      setDashboardData({
        totalMilkings,
        totalLiters,
        averagePerMilking,
      });

    } catch (err) {
      console.error('Error loading employee dashboard:', err);
      setError(err.message);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

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

  const handleNavigation = (route) => {
    router.push(`/(tabs)/${route}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      {/* Decorative Background Elements */}
      <View style={styles.backgroundContainer}>
        <Svg
          style={[styles.blob, styles.blob1]}
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

      {/* Main Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Loading State */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : (
          <>
            {/* Resumen del Día */}
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen del Día</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <View style={styles.statContent}>
                      <View>
                        <Text style={styles.statLabel}>Ordeños</Text>
                        <Text style={styles.statValue}>{dashboardData.totalMilkings}</Text>
                      </View>
                      <Droplet color={"#fff"} />
                    </View>
                  </View>
                  <View style={styles.statCard}>
                    <View style={styles.statContent}>
                      <View>
                        <Text style={styles.statLabel}>Litros</Text>
                        <Text style={styles.statValue}>{dashboardData.totalLiters}</Text>
                      </View>
                      <ChartLine color={"#fff"} />
                    </View>
                  </View>
                </View>
                <View style={styles.averageCard}>
                  <Text style={styles.averageText}>
                    Promedio: {dashboardData.averagePerMilking}L por ordeño
                  </Text>
                </View>
              </View>
            </View>

            {/* Alertas - Ocultas hasta implementar endpoint */}
            {/* TODO: Implementar cuando el backend tenga endpoint de alertas */}
            {false && (
              <View style={styles.alertsSection}>
                <View style={styles.alertsHeader}>
                  <Text style={styles.sectionTitle}>Alertas</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>0</Text>
                  </View>
                </View>
                <View style={styles.alertsList}>
                  <Text style={styles.alertDescription}>No hay alertas disponibles</Text>
                </View>
              </View>
            )}

            {/* Accesos Rápidos */}
            <View style={styles.quickAccessSection}>
              <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
              <View style={styles.quickAccessGrid}>
                <TouchableOpacity
                  style={styles.quickAccessCard}
                  onPress={() => handleNavigation("inventory")}
                >
                  <Blocks size={30} />
                  <Text style={styles.quickAccessTitle}>Mi Inventario</Text>
                  <Text style={styles.quickAccessDesc}>Gestionar recursos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAccessCard}
                  onPress={() => router.push("/configurationProfile")}
                >
                  <User size={30} />
                  <Text style={styles.quickAccessTitle}>Mi Perfil</Text>
                  <Text style={styles.quickAccessDesc}>Configuración</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  },
  blob1: {
    right: -100,
    top: 200,
    transform: [{ rotate: "-27.557deg" }, { scaleX: 2.5 }, { scaleY: 2 }],
  },
  scrollContainer: {
    flex: 1,
    zIndex: 1,
  },
  main: {
    paddingHorizontal: Math.max(16, screenWidth * 0.035),
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
  summarySection: {
    marginTop: Math.max(20, screenHeight * 0.025),
    marginBottom: Math.max(20, screenHeight * 0.025),
  },
  summaryCard: {
    backgroundColor: "#3B82F6",
    borderRadius: Math.max(12, screenWidth * 0.03),
    padding: Math.max(20, screenWidth * 0.04),
  },
  summaryTitle: {
    fontSize: Math.max(16, screenWidth * 0.038),
    fontWeight: "600",
    color: "#FFF",
    marginBottom: Math.max(14, screenHeight * 0.017),
  },
  statsRow: {
    flexDirection: "row",
    gap: Math.max(12, screenWidth * 0.03),
    marginBottom: Math.max(14, screenHeight * 0.017),
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.70)",
    borderRadius: Math.max(10, screenWidth * 0.025),
    padding: Math.max(14, screenWidth * 0.03),
  },
  statContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: Math.max(13, screenWidth * 0.03),
    fontWeight: "400",
    color: "#FFF",
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  statValue: {
    fontSize: Math.max(22, screenWidth * 0.05),
    fontWeight: "700",
    color: "#FFF",
    lineHeight: Math.max(29, screenWidth * 0.065),
  },
  averageCard: {
    backgroundColor: "rgba(0, 0, 0, 0.70)",
    borderRadius: Math.max(6, screenWidth * 0.015),
    padding: Math.max(10, screenWidth * 0.025),
  },
  averageText: {
    fontSize: Math.max(13, screenWidth * 0.03),
    fontWeight: "400",
    color: "#FFF",
  },
  alertsSection: {
    marginBottom: Math.max(20, screenHeight * 0.025),
  },
  alertsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Math.max(14, screenHeight * 0.017),
  },
  sectionTitle: {
    fontSize: Math.max(16, screenWidth * 0.038),
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    width: Math.max(20, screenWidth * 0.05),
    height: Math.max(20, screenWidth * 0.05),
    borderRadius: Math.max(10, screenWidth * 0.025),
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: Math.max(11, screenWidth * 0.025),
    fontWeight: "500",
    color: "#000",
  },
  alertsList: {
    gap: Math.max(10, screenHeight * 0.012),
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Math.max(10, screenWidth * 0.025),
    backgroundColor: "#FFF",
    borderRadius: Math.max(10, screenWidth * 0.025),
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    padding: Math.max(14, screenWidth * 0.03),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Math.max(14, screenWidth * 0.034),
    fontWeight: "500",
    color: "#111827",
    marginBottom: Math.max(3, screenHeight * 0.004),
  },
  alertDescription: {
    fontSize: Math.max(13, screenWidth * 0.03),
    fontWeight: "400",
    color: "#4B5563",
    marginBottom: Math.max(3, screenHeight * 0.004),
  },
  alertTime: {
    fontSize: Math.max(11, screenWidth * 0.025),
    fontWeight: "400",
    color: "#000",
  },
  quickAccessSection: {
    marginBottom: Math.max(20, screenHeight * 0.025),
  },
  quickAccessGrid: {
    flexDirection: "row",
    gap: Math.max(12, screenWidth * 0.03),
    marginTop: Math.max(14, screenHeight * 0.017),
  },
  quickAccessCard: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: Math.max(10, screenWidth * 0.025),
    padding: Math.max(14, screenWidth * 0.03),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAccessTitle: {
    paddingTop: 8,
    fontSize: Math.max(14, screenWidth * 0.034),
    fontWeight: "500",
    color: "#111827",
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  quickAccessDesc: {
    fontSize: Math.max(13, screenWidth * 0.03),
    fontWeight: "400",
    color: "#4B5563",
  },
};