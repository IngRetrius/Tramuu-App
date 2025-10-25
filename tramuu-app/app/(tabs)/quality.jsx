
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  EllipsisVertical,
  FileText,
  History,
  RefreshCw,
  X
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import KeyboardAwareWrapper from "@/components/KeyboardAwareWrapper";
import { qualityService } from '@/services';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Quality() {
  const [activeTab, setActiveTab] = useState('pruebas'); // pruebas, historial, alertas
  const [selectedSample, setSelectedSample] = useState('');
  const [selectedCows, setSelectedCows] = useState('');
  const [grasa, setGrasa] = useState('');
  const [proteina, setProteina] = useState('');
  const [lactosa, setLactosa] = useState('');
  const [ufc, setUfc] = useState('');
  const [acidez, setAcidez] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);

  // Backend integration states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tests, setTests] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    if (activeTab === 'historial') {
      loadTests();
    } else if (activeTab === 'alertas') {
      loadStatistics();
    }
  }, [activeTab]);

  const loadTests = async () => {
    try {
      setLoading(true);
      console.log('📋 Cargando pruebas de calidad...');
      const data = await qualityService.getQualityTests({ limit: 20 });
      console.log('📋 Datos recibidos:', data);
      const testsArray = data.tests || data || [];
      console.log('📋 Pruebas procesadas:', testsArray.length);
      setTests(testsArray);
    } catch (error) {
      console.error('❌ Error loading quality tests:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert('Error', 'No se pudieron cargar las pruebas de calidad');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando estadísticas de calidad...');
      const data = await qualityService.getStatistics();
      console.log('📊 Estadísticas recibidas:', data);
      setStatistics(data);
    } catch (error) {
      console.error('❌ Error loading statistics:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetForm = () => {
    setGrasa('');
    setProteina('');
    setLactosa('');
    setUfc('');
    setAcidez('');
    setObservaciones('');
    setSelectedSample('');
    setSelectedCows('');
    setPhotoUri(null);
    setPhotoBase64(null);
  };

  const Tab = ({ id, title, icon: Icon, isSelected, onPress, hasNotification }) => (
    <TouchableOpacity
      style={[styles.tab, isSelected && styles.tabSelected]}
      onPress={onPress}
    >
      <View style={styles.tabContent}>
        {Icon && <Icon size={16} color={isSelected ? '#3B82F6' : '#6B7280'} />}
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {title}
        </Text>
        {hasNotification && (
          <View style={styles.notificationDot} />
        )}
      </View>
      {isSelected && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    range,
    suffix,
    maxValue,
    keyboardType = 'default'
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
        />
        {suffix && (
          <Text style={styles.inputSuffix}>{suffix}</Text>
        )}
      </View>
      {range && (
        <Text style={styles.rangeText}>Rango: {range}</Text>
      )}
      {maxValue && (
        <Text style={styles.rangeText}>Max: {maxValue}</Text>
      )}
    </View>
  );

  const Dropdown = ({ label, value, placeholder, onPress, isOptional = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {isOptional && <Text style={styles.optionalText}>(Opcional)</Text>}
      </Text>
      <TouchableOpacity style={styles.dropdownWrapper} onPress={onPress}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const handleSampleSelect = () => {
    Alert.alert(
      "Seleccionar Muestra",
      "Funcionalidad de selección de muestra en desarrollo"
    );
  };

  const handleCowSelect = () => {
    Alert.alert(
      "Seleccionar Vacas",
      "Funcionalidad de selección de vacas en desarrollo"
    );
  };

  const handleCapturePhoto = async () => {
    try {
      console.log('📸 Solicitando permisos de cámara...');
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      console.log('📸 Estado de permisos:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Se necesitan permisos de cámara para tomar fotos del ensayo'
        );
        return;
      }

      // Show options: Camera or Gallery
      Alert.alert(
        'Foto del Ensayo',
        'Selecciona una opción',
        [
          {
            text: 'Tomar Foto',
            onPress: async () => {
              try {
                console.log('📸 Abriendo cámara...');
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.7,
                  base64: true,
                });

                console.log('📸 Resultado de cámara:', result.canceled ? 'Cancelado' : 'Foto capturada');

                if (!result.canceled && result.assets[0]) {
                  console.log('📸 Foto guardada, tamaño base64:', result.assets[0].base64?.length || 0);
                  setPhotoUri(result.assets[0].uri);
                  setPhotoBase64(result.assets[0].base64);
                }
              } catch (camError) {
                console.error('❌ Error al abrir cámara:', camError);
                Alert.alert('Error', 'No se pudo abrir la cámara');
              }
            }
          },
          {
            text: 'Elegir de Galería',
            onPress: async () => {
              try {
                console.log('📸 Abriendo galería...');
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.7,
                  base64: true,
                });

                console.log('📸 Resultado de galería:', result.canceled ? 'Cancelado' : 'Foto seleccionada');

                if (!result.canceled && result.assets[0]) {
                  console.log('📸 Foto guardada, tamaño base64:', result.assets[0].base64?.length || 0);
                  setPhotoUri(result.assets[0].uri);
                  setPhotoBase64(result.assets[0].base64);
                }
              } catch (galError) {
                console.error('❌ Error al abrir galería:', galError);
                Alert.alert('Error', 'No se pudo abrir la galería');
              }
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('❌ Error capturing photo:', error);
      Alert.alert('Error', 'No se pudo capturar la foto');
    }
  };

  const handleSaveDraft = () => {
    Alert.alert(
      "Borrador Guardado",
      "La prueba ha sido guardada como borrador"
    );
  };

  const handleRegisterTest = async () => {
    try {
      // Validate required fields
      if (!grasa || !proteina || !lactosa || !ufc || !acidez) {
        Alert.alert('Error', 'Por favor completa todos los parámetros de calidad');
        return;
      }

      // Validate numeric values
      const fatValue = parseFloat(grasa);
      const proteinValue = parseFloat(proteina);
      const lactoseValue = parseFloat(lactosa);
      const ufcValue = parseInt(ufc);
      const acidityValue = parseFloat(acidez);

      if (isNaN(fatValue) || isNaN(proteinValue) || isNaN(lactoseValue) || isNaN(ufcValue) || isNaN(acidityValue)) {
        Alert.alert('Error', 'Por favor ingresa valores numéricos válidos');
        return;
      }

      setLoading(true);

      const qualityData = {
        fat: fatValue,
        protein: proteinValue,
        lactose: lactoseValue,
        ufc: ufcValue,
        acidity: acidityValue,
        notes: observaciones.trim() || undefined,
        photo: photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : undefined,
        date: new Date().toISOString().split('T')[0],
      };

      console.log('📊 Enviando datos de calidad:', {
        ...qualityData,
        photo: qualityData.photo ? `[Base64 Image - ${qualityData.photo.length} chars]` : 'Sin foto'
      });

      const response = await qualityService.createQualityTest(qualityData);

      console.log('✅ Prueba de calidad creada:', response);

      Alert.alert(
        'Registro exitoso',
        'La prueba de calidad ha sido registrada correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              setActiveTab('historial');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error registering quality test:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = error.response?.data?.message
        || error.message
        || 'Error al registrar la prueba de calidad';

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPruebas = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Nueva Prueba Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Nueva Prueba de Calidad</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>ID: ML-2024-001</Text>
          </View>
        </View>

        {/* Sample Selection */}
        <Dropdown
          label="Muestra (ID Bodega)"
          value={selectedSample}
          placeholder="Seleccionar muestra..."
          onPress={handleSampleSelect}
        />

        {/* Cows Selection */}
        <Dropdown
          label="Vacas"
          value={selectedCows}
          placeholder="Todas las vacas"
          onPress={handleCowSelect}
          isOptional
        />
      </View>

      {/* Quality Parameters Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parámetros de Calidad</Text>

        <View style={styles.parametersGrid}>
          <View style={styles.parameterRow}>
            <InputField
              label="Grasa %"
              value={grasa}
              onChangeText={setGrasa}
              placeholder="3.25"
              range="3.0-4.5%"
              keyboardType="decimal-pad"
            />
            <InputField
              label="Proteína %"
              value={proteina}
              onChangeText={setProteina}
              placeholder="3.10"
              range="2.8-3.5%"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.parameterRow}>
            <InputField
              label="Lactosa %"
              value={lactosa}
              onChangeText={setLactosa}
              placeholder="4.80"
              range="4.5-5.0%"
              keyboardType="decimal-pad"
            />
            <InputField
              label="UFC"
              value={ufc}
              onChangeText={setUfc}
              placeholder="50000"
              maxValue="100,000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <InputField
          label="Acidez"
          value={acidez}
          onChangeText={setAcidez}
          placeholder="6.8"
          range="6.5-7.2 pH"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Photo Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Foto del Ensayo</Text>
          {photoUri && (
            <TouchableOpacity onPress={() => {
              setPhotoUri(null);
              setPhotoBase64(null);
            }}>
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {photoUri ? (
          <TouchableOpacity style={styles.photoContainer} onPress={handleCapturePhoto}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            <View style={styles.changePhotoButton}>
              <Camera size={16} color="#FFFFFF" />
              <Text style={styles.changePhotoButtonText}>Cambiar Foto</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.photoContainer} onPress={handleCapturePhoto}>
            <View style={styles.photoPlaceholder}>
              <Camera size={40} color="#9CA3AF" />
              <Text style={styles.photoText}>Tomar foto del ensayo</Text>
              <View style={styles.captureButton}>
                <Camera size={16} color="#FFFFFF" />
                <Text style={styles.captureButtonText}>Capturar</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Observations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Observaciones</Text>
        <View style={styles.observationsWrapper}>
          <TextInput
            style={styles.observationsInput}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Agregar observaciones adicionales..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.draftButton} onPress={handleSaveDraft}>
          <Text style={styles.draftButtonText}>Guardar Borrador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegisterTest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Registrar Prueba</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderHistorial = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.emptyText}>Cargando pruebas...</Text>
        </View>
      );
    }

    if (tests.length === 0) {
      return (
        <View style={styles.emptyState}>
          <History size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Historial de Pruebas</Text>
          <Text style={styles.emptyText}>Las pruebas de calidad anteriores aparecerán aquí</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadTests}
          >
            <RefreshCw size={16} color="#60A5FA" />
            <Text style={styles.retryButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadTests();
          }} />
        }
      >
        {tests.map((test) => (
          <View key={test.id} style={styles.testCard}>
            <View style={styles.testHeader}>
              <View style={styles.testIdBadge}>
                <Text style={styles.testIdText}>#{test.id}</Text>
              </View>
              <Text style={styles.testDate}>
                {new Date(test.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>

            <View style={styles.testParameters}>
              <View style={styles.testParam}>
                <Text style={styles.testParamLabel}>Grasa</Text>
                <Text style={styles.testParamValue}>{test.fat}%</Text>
              </View>
              <View style={styles.testParam}>
                <Text style={styles.testParamLabel}>Proteína</Text>
                <Text style={styles.testParamValue}>{test.protein}%</Text>
              </View>
              <View style={styles.testParam}>
                <Text style={styles.testParamLabel}>Lactosa</Text>
                <Text style={styles.testParamValue}>{test.lactose}%</Text>
              </View>
              <View style={styles.testParam}>
                <Text style={styles.testParamLabel}>UFC</Text>
                <Text style={styles.testParamValue}>{test.ufc?.toLocaleString()}</Text>
              </View>
            </View>

            {test.notes && (
              <Text style={styles.testNotes}>{test.notes}</Text>
            )}
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderAlertas = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.emptyText}>Cargando alertas...</Text>
        </View>
      );
    }

    // Generate alerts based on statistics
    const alerts = [];
    if (statistics) {
      if (statistics.averageFat < 3.0) {
        alerts.push({
          id: 1,
          type: 'warning',
          title: 'Grasa Baja',
          message: `El promedio de grasa está en ${statistics.averageFat}%, por debajo del rango óptimo (3.0-4.5%)`
        });
      }
      if (statistics.averageProtein < 2.8) {
        alerts.push({
          id: 2,
          type: 'warning',
          title: 'Proteína Baja',
          message: `El promedio de proteína está en ${statistics.averageProtein}%, por debajo del rango óptimo (2.8-3.5%)`
        });
      }
      if (statistics.averageUfc > 100000) {
        alerts.push({
          id: 3,
          type: 'critical',
          title: 'UFC Elevado',
          message: `El conteo promedio de UFC es ${statistics.averageUfc.toLocaleString()}, superando el máximo permitido`
        });
      }
    }

    if (alerts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertTriangle size={48} color="#10B981" />
          <Text style={styles.emptyTitle}>Sin Alertas</Text>
          <Text style={styles.emptyText}>La calidad de la leche está dentro de los parámetros óptimos</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollContainer}>
        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              alert.type === 'critical' ? styles.alertCardCritical : styles.alertCardWarning
            ]}
          >
            <View style={styles.alertIcon}>
              <AlertTriangle size={24} color={alert.type === 'critical' ? '#EF4444' : '#F59E0B'} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
            </View>
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

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
            id="pruebas"
            title="Pruebas"
            icon={FileText}
            isSelected={activeTab === 'pruebas'}
            onPress={() => setActiveTab('pruebas')}
          />
          <Tab
            id="historial"
            title="Historial"
            icon={History}
            isSelected={activeTab === 'historial'}
            onPress={() => setActiveTab('historial')}
          />
          <Tab
            id="alertas"
            title="Alertas"
            icon={AlertTriangle}
            isSelected={activeTab === 'alertas'}
            onPress={() => setActiveTab('alertas')}
            hasNotification
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'pruebas' && renderPruebas()}
          {activeTab === 'historial' && renderHistorial()}
          {activeTab === 'alertas' && renderAlertas()}
        </View>
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
    right: -130,
    top: 300,
    transform: [{ rotate: "-15.557deg" }, { scaleX: 1 }, { scaleY: 2 }],
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
    paddingHorizontal: 12,
    position: 'relative',
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
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
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
    marginTop: 16,
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
  idBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
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
  optionalText: {
    color: '#9CA3AF',
    fontWeight: '400',
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
  inputSuffix: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  rangeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
  parametersGrid: {
    gap: 0,
  },
  parameterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoContainer: {
    marginTop: 8,
  },
  photoPlaceholder: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  photoText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 12,
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#60A5FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  changePhotoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  observationsWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 8,
  },
  observationsInput: {
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EBF8FF',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60A5FA',
    marginLeft: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  testCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  testIdBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  testIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  testDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  testParameters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  testParam: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  testParamLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  testParamValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  testNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },
  alertCardWarning: {
    borderLeftColor: '#F59E0B',
  },
  alertCardCritical: {
    borderLeftColor: '#EF4444',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
