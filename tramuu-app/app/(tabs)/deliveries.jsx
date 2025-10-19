import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  MoreHorizontal,
  Plus,
  Truck,
  Users,
  RefreshCw,
  AlertCircle
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import KeyboardAwareWrapper from '@/components/KeyboardAwareWrapper';
import { deliveriesService, employeesService } from '@/services';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Deliveries() {
  const [activeTab, setActiveTab] = useState('programar'); // programar, entregar, clientes
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('Litros');
  const [hora, setHora] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [direccion, setDireccion] = useState('');
  const [lecheroAsignado, setLecheroAsignado] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [notas, setNotas] = useState('');

  // Estados para controlar la visibilidad de los pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Data states
  const [deliveries, setDeliveries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statistics, setStatistics] = useState(null);

  // Load data on mount and when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, selectedDate]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'programar') {
        await loadDeliveries({ date: selectedDate.toISOString().split('T')[0] });
      } else if (activeTab === 'entregar') {
        await loadDeliveries({ status: 'IN_PROGRESS' });
      }
    } catch (err) {
      console.error('Error loading deliveries:', err);
      setError(err.message || 'Error al cargar las entregas');
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async (params = {}) => {
    try {
      const data = await deliveriesService.getDeliveries(params);
      setDeliveries(data || []);
    } catch (error) {
      throw error;
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeesService.getEmployees();
      setEmployees(data || []);
      // Auto-select first employee if available
      if (data && data.length > 0 && !selectedEmployeeId) {
        setSelectedEmployeeId(data[0].id);
        setLecheroAsignado(`${data[0].firstName} ${data[0].lastName}`);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await deliveriesService.getStatistics();
      setStatistics(data || null);
    } catch (error) {
      throw error;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const resetForm = () => {
    setSelectedClient('');
    setCantidad('');
    setDireccion('');
    setNotas('');
    setHora('');
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B';
      case 'IN_PROGRESS':
        return '#3B82F6';
      case 'COMPLETED':
        return '#10B981';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Camino';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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

  const Dropdown = ({ value, placeholder, onPress }) => (
    <TouchableOpacity style={styles.dropdownWrapper} onPress={onPress}>
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <ChevronDown size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  const InputField = ({ label, value, onChangeText, placeholder, rightIcon: RightIcon, onRightPress }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
        {RightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.inputIcon}>
            <RightIcon size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const DeliveryCard = ({ delivery }) => (
    <View style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryClient}>{delivery.clientName}</Text>
          <Text style={styles.deliveryDetails}>
            {delivery.quantity.toLocaleString()} L • {formatTime(delivery.scheduledDate)}
          </Text>
          <Text style={styles.deliveryAddress}>{delivery.deliveryAddress}</Text>
        </View>
        <View style={styles.deliveryActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(delivery.status)}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleClientSelect = () => {
    Alert.alert("Seleccionar Cliente", "Funcionalidad de selección de cliente en desarrollo");
  };

  const handleTimeSelect = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedTime,
        onChange: onTimeChange,
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowTimePicker(true);
    }
  };

  const handleDateSelect = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate,
        onChange: onDateChange,
        mode: 'date',
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const onTimeChange = (event, time) => {
    const currentTime = time || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentTime);
    
    // Formatear la hora para mostrar
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    setHora(`${hours}:${minutes}`);
  };

  const handleLecheroSelect = () => {
    Alert.alert("Seleccionar Lechero", "Funcionalidad de selección de lechero en desarrollo");
  };

  const handleProgramarEntrega = async () => {
    try {
      // Validations
      if (!selectedClient || selectedClient.trim() === '') {
        Alert.alert('Error', 'Por favor ingresa el nombre del cliente');
        return;
      }

      if (!cantidad || parseFloat(cantidad) <= 0) {
        Alert.alert('Error', 'Por favor ingresa una cantidad válida');
        return;
      }

      if (!direccion || direccion.trim() === '') {
        Alert.alert('Error', 'Por favor ingresa la dirección de entrega');
        return;
      }

      if (!selectedEmployeeId) {
        Alert.alert('Error', 'Por favor selecciona un lechero');
        return;
      }

      setSaving(true);

      // Create scheduled datetime
      const scheduledDateTime = new Date(selectedDate);
      if (hora) {
        const [hours, minutes] = hora.split(':');
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      const deliveryData = {
        clientName: selectedClient.trim(),
        deliveryAddress: direccion.trim(),
        quantity: parseFloat(cantidad),
        scheduledDate: scheduledDateTime.toISOString(),
        assignedEmployeeId: selectedEmployeeId,
        notes: notas.trim() || undefined
      };

      await deliveriesService.createDelivery(deliveryData);

      Alert.alert(
        'Éxito',
        'La entrega ha sido programada exitosamente',
        [{ text: 'OK', onPress: () => {
          resetForm();
          loadData();
        }}]
      );
    } catch (error) {
      console.error('Error creating delivery:', error);
      const message = error.response?.data?.message || error.message || 'Error al programar la entrega';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  const renderProgramar = () => (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
      }
    >
      {/* Date Selection Section */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>Seleccionar Fecha</Text>
        </View>

        <TouchableOpacity style={styles.dateButton} onPress={handleDateSelect}>
          <CalendarIcon size={20} color="#3B82F6" />
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Nueva Entrega Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nueva Entrega</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cliente</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={selectedClient}
              onChangeText={setSelectedClient}
              placeholder="Nombre del cliente"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.quantityRow}>
          <View style={styles.quantityInput}>
            <Text style={styles.inputLabel}>Cantidad</Text>
            <TextInput
              style={styles.quantityField}
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.unitInput}>
            <Text style={styles.inputLabel}>Unidad</Text>
            <Dropdown
              value={unidad}
              placeholder="Litros"
              onPress={() => Alert.alert("Unidad", "Seleccionar unidad")}
            />
          </View>
        </View>

        <InputField
          label="Hora"
          value={hora || 'Seleccionar hora'}
          onChangeText={setHora}
          placeholder="--:-- --"
          rightIcon={Clock}
          onRightPress={handleTimeSelect}
        />

        <InputField
          label="Dirección"
          value={direccion}
          onChangeText={setDireccion}
          placeholder="Dirección de entrega"
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Lechero Asignado</Text>
          <Dropdown
            value={lecheroAsignado}
            placeholder="Seleccionar lechero"
            onPress={handleLecheroSelect}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notas</Text>
          <View style={styles.notesWrapper}>
            <TextInput
              style={styles.notesInput}
              value={notas}
              onChangeText={setNotas}
              placeholder="Observaciones adicionales"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.programButton, saving && styles.programButtonDisabled]}
          onPress={handleProgramarEntrega}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.programButtonText}>Programar Entrega</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Entregas del día */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Entregas del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
        </Text>
        {loading && !refreshing ? (
          <View style={styles.loadingSmall}>
            <ActivityIndicator color="#3B82F6" />
          </View>
        ) : deliveries.length === 0 ? (
          <View style={styles.emptyDeliveries}>
            <Truck size={32} color="#9CA3AF" />
            <Text style={styles.emptyDeliveriesText}>No hay entregas programadas para este día</Text>
          </View>
        ) : (
          <View style={styles.deliveriesContainer}>
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderEntregar = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando entregas...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error al cargar entregas</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <RefreshCw size={20} color="#3B82F6" />
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!deliveries || deliveries.length === 0) {
      return (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
          }
        >
          <Truck size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay entregas activas</Text>
          <Text style={styles.emptyText}>Las entregas en curso aparecerán aquí</Text>
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
          <Text style={styles.cardTitle}>Entregas en Progreso</Text>
          <View style={styles.deliveriesContainer}>
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </View>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderClientes = () => (
    <View style={styles.emptyState}>
      <Users size={48} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Gestión de Clientes</Text>
      <Text style={styles.emptyText}>Lista de clientes y direcciones de entrega</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <KeyboardAwareWrapper keyboardVerticalOffset={100}>

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
            id="programar"
            title="Programar"
            icon={CalendarIcon}
            isSelected={activeTab === 'programar'}
            onPress={() => setActiveTab('programar')}
          />
          <Tab
            id="entregar"
            title="Entregar"
            icon={Truck}
            isSelected={activeTab === 'entregar'}
            onPress={() => setActiveTab('entregar')}
          />
          <Tab
            id="clientes"
            title="Clientes"
            icon={Users}
            isSelected={activeTab === 'clientes'}
            onPress={() => setActiveTab('clientes')}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'programar' && renderProgramar()}
          {activeTab === 'entregar' && renderEntregar()}
          {activeTab === 'clientes' && renderClientes()}
        </View>

        {/* Add Button */}
        {activeTab !== 'programar' && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Date Time Pickers - Solo para iOS */}
        {Platform.OS === 'ios' && showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        
        {Platform.OS === 'ios' && showTimePicker && (
          <DateTimePicker
            testID="timeTimePicker"
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
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
  calendarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
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
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    textTransform: 'capitalize',
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  inputIcon: {
    padding: 4,
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
  quantityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1,
  },
  quantityField: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  notesWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  notesInput: {
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  programButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  programButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deliveriesContainer: {
    gap: 12,
  },
  deliveryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  deliveryDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deliveryActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  moreButton: {
    padding: 4,
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
  loadingSmall: {
    paddingVertical: 20,
    alignItems: 'center',
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
  emptyDeliveries: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyDeliveriesText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  programButtonDisabled: {
    opacity: 0.6,
  },
});