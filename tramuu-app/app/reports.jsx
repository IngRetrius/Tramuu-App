import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  BarChart3,
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  FileText,
  Mail,
  PieChart,
  TrendingUp
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import KeyboardAwareWrapper from '@/components/KeyboardAwareWrapper';
import { Stack } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Reports() {
  const [activeTab, setActiveTab] = useState('reportes'); // reportes, analytics, financiero
  const [selectedPeriod, setSelectedPeriod] = useState('Diario');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(2024, 0, 1)); // 2024-01-01
  const [selectedEndDate, setSelectedEndDate] = useState(new Date(2024, 0, 31)); // 2024-01-31
  const [selectedCows, setSelectedCows] = useState('Todas las vacas');
  const [selectedMilkers, setSelectedMilkers] = useState('Todos los lecheros');
  const [selectedLots, setSelectedLots] = useState('Todos los lotes');

  // Estados para controlar la visibilidad de los pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Datos de ejemplo para el resumen
  const summaryData = {
    totalProducido: '1,240L',
    promedioDiario: '40L',
    vacasActivas: '12',
    eficiencia: '98%'
  };

  const periodOptions = ['Diario', 'Semanal', 'Mensual', 'Anual'];

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

  const Dropdown = ({ value, placeholder, onPress }) => (
    <TouchableOpacity style={styles.dropdownWrapper} onPress={onPress}>
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <ChevronDown size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  const SummaryCard = ({ title, value, icon: Icon, color = '#60A5FA' }) => (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIconContainer, { backgroundColor: color }]}>
        <Icon size={20} color="#FFFFFF" />
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </View>
  );

  const ExportButton = ({ title, icon: Icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.exportButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Icon size={20} color="#FFFFFF" />
      <Text style={styles.exportButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const handleDateSelect = (type) => {
    const currentDate = type === 'start' ? selectedStartDate : selectedEndDate;
    const setDate = type === 'start' ? setSelectedStartDate : setSelectedEndDate;
    const setShowPicker = type === 'start' ? setShowStartDatePicker : setShowEndDatePicker;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate,
        onChange: (event, date) => {
          if (date) {
            setDate(date);
          }
        },
        mode: 'date',
      });
    } else {
      setShowPicker(true);
    }
  };

  const onStartDateChange = (event, date) => {
    const currentDate = date || selectedStartDate;
    setShowStartDatePicker(false);
    setSelectedStartDate(currentDate);
  };

  const onEndDateChange = (event, date) => {
    const currentDate = date || selectedEndDate;
    setShowEndDatePicker(false);
    setSelectedEndDate(currentDate);
  };

  const handleDropdownSelect = (type) => {
    let title = '';
    let message = '';

    switch (type) {
      case 'cows':
        title = 'Filtrar por Vacas';
        message = 'Seleccionar vacas específicas para el reporte';
        break;
      case 'milkers':
        title = 'Filtrar por Lecheros';
        message = 'Seleccionar lecheros específicos para el reporte';
        break;
      case 'lots':
        title = 'Filtrar por Lotes';
        message = 'Seleccionar lotes específicos para el reporte';
        break;
    }

    Alert.alert(title, message);
  };

  const handleExport = (type) => {
    let message = '';
    switch (type) {
      case 'pdf':
        message = 'Generando reporte en PDF...';
        break;
      case 'excel':
        message = 'Generando reporte en Excel...';
        break;
      case 'email':
        message = 'Preparando reporte para envío por email...';
        break;
    }
    Alert.alert('Exportar Reporte', message);
  };

  const renderReportes = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Período de Reporte */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Período de Reporte</Text>
        <View style={styles.periodContainer}>
          {periodOptions.map((period) => (
            <PeriodButton
              key={period}
              period={period}
              isSelected={selectedPeriod === period}
              onPress={() => setSelectedPeriod(period)}
            />
          ))}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Filtrar por</Text>

        <View style={styles.inputContainer}>
          <Dropdown
            value={selectedCows}
            placeholder="Todas las vacas"
            onPress={() => handleDropdownSelect('cows')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            value={selectedMilkers}
            placeholder="Todos los lecheros"
            onPress={() => handleDropdownSelect('milkers')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            value={selectedLots}
            placeholder="Todos los lotes"
            onPress={() => handleDropdownSelect('lots')}
          />
        </View>
      </View>

      {/* Rango de Fechas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rango de Fechas</Text>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => handleDateSelect('start')}
          >
            <CalendarIcon size={16} color="#6B7280" />
            <Text style={styles.dateInputText}>
              {selectedStartDate.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => handleDateSelect('end')}
          >
            <CalendarIcon size={16} color="#6B7280" />
            <Text style={styles.dateInputText}>
              {selectedEndDate.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resumen del Período */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen del Período</Text>
        <View style={styles.summaryGrid}>
          <SummaryCard
            title="Total Producido"
            value={summaryData.totalProducido}
            icon={TrendingUp}
            color="#60A5FA"
          />
          <SummaryCard
            title="Promedio Diario"
            value={summaryData.promedioDiario}
            icon={BarChart3}
            color="#60A5FA"
          />
          <SummaryCard
            title="Vacas Activas"
            value={summaryData.vacasActivas}
            icon={PieChart}
            color="#60A5FA"
          />
          <SummaryCard
            title="Eficiencia"
            value={summaryData.eficiencia}
            icon={TrendingUp}
            color="#60A5FA"
          />
        </View>
      </View>

      {/* Exportar Reporte */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Exportar Reporte</Text>
        <View style={styles.exportContainer}>
          <ExportButton
            title="PDF"
            icon={FileText}
            color="#EF4444"
            onPress={() => handleExport('pdf')}
          />
          <ExportButton
            title="Excel"
            icon={Download}
            color="#60A5FA"
            onPress={() => handleExport('excel')}
          />
        </View>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => handleExport('email')}
        >
          <Mail size={20} color="#FFFFFF" />
          <Text style={styles.emailButtonText}>Compartir por Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderAnalytics = () => (
    <View style={styles.emptyState}>
      <BarChart3 size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Analytics</Text>
      <Text style={styles.emptyText}>Gráficos y análisis detallados de producción</Text>
    </View>
  );

  const renderFinanciero = () => (
    <View style={styles.emptyState}>
      <TrendingUp size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Financiero</Text>
      <Text style={styles.emptyText}>Reportes financieros y análisis de rentabilidad</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <KeyboardAwareWrapper keyboardVerticalOffset={100}>
        <Stack.Screen
          options={{
            title: "Reportes y Analíticas",
          }}
        />

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
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Tab
            id="reportes"
            title="Reportes"
            icon={FileText}
            isSelected={activeTab === 'reportes'}
            onPress={() => setActiveTab('reportes')}
          />
          <Tab
            id="analytics"
            title="Analíticas"
            icon={BarChart3}
            isSelected={activeTab === 'analytics'}
            onPress={() => setActiveTab('analytics')}
          />
          <Tab
            id="financiero"
            title="Financiero"
            icon={TrendingUp}
            isSelected={activeTab === 'financiero'}
            onPress={() => setActiveTab('financiero')}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'reportes' && renderReportes()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'financiero' && renderFinanciero()}
        </View>

        {/* Date Time Pickers - Solo para iOS */}
        {Platform.OS === 'ios' && showStartDatePicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={selectedStartDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {Platform.OS === 'ios' && showEndDatePicker && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={selectedEndDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}
      </KeyboardAwareWrapper>
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
    right: -50,
    top: -50,
    transform: [{ rotate: "-50deg" }, { scaleX: 2.4 }, { scaleY: 2 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  menuButton: {
    padding: 4,
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
    fontSize: 14,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodButtonSelected: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  periodButtonTextSelected: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  dropdownWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dateInputText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#60A5FA',
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  exportContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emailButton: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
});