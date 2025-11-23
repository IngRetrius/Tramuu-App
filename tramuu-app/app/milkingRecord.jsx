import { Stack, router } from 'expo-router';
import {
  Check,
  List,
  Moon,
  Sun,
  User,
  Zap,
  Plus,
  Trash2
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CowSelector from '@/components/milking/CowSelector';
import { milkingsService } from '@/services';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function MilkingRecord() {
  const [selectedType, setSelectedType] = useState('rapid'); // rapid, individual, massive
  const [selectedShift, setSelectedShift] = useState('AM'); // AM, PM
  const [cowCount, setCowCount] = useState('25');
  const [totalLiters, setTotalLiters] = useState('180.5');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Individual milking state
  const [selectedCow, setSelectedCow] = useState(null);
  const [individualLiters, setIndividualLiters] = useState('');

  // Massive milking state
  const [massiveCows, setMassiveCows] = useState([]);
  const [showCowSelector, setShowCowSelector] = useState(false);

  const handleRegisterMilking = async () => {
    try {
      setLoading(true);

      // Get current date and time
      const now = new Date();
      const milkingDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const milkingTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

      const baseData = {
        milkingDate,
        milkingTime,
        shift: selectedShift,
        notes: notes.trim() || undefined
      };

      // Validation and API call based on type
      if (selectedType === 'rapid') {
        if (!cowCount.trim() || parseInt(cowCount) <= 0) {
          Alert.alert('Error', 'Por favor ingresa el número de vacas');
          return;
        }
        if (!totalLiters.trim() || parseFloat(totalLiters) <= 0) {
          Alert.alert('Error', 'Por favor ingresa la cantidad de litros');
          return;
        }

        await milkingsService.createRapidMilking({
          ...baseData,
          cowCount: parseInt(cowCount),
          totalLiters: parseFloat(totalLiters),
        });

      } else if (selectedType === 'individual') {
        if (!selectedCow) {
          Alert.alert('Error', 'Por favor selecciona una vaca');
          return;
        }
        if (!individualLiters.trim() || parseFloat(individualLiters) <= 0) {
          Alert.alert('Error', 'Por favor ingresa la cantidad de litros');
          return;
        }

        await milkingsService.createIndividualMilking({
          ...baseData,
          cows: [{
            cowId: selectedCow.id,
            liters: parseFloat(individualLiters),
          }]
        });

      } else if (selectedType === 'massive') {
        if (massiveCows.length === 0) {
          Alert.alert('Error', 'Por favor agrega al menos una vaca');
          return;
        }

        const allHaveLiters = massiveCows.every(c => c.liters && parseFloat(c.liters) > 0);
        if (!allHaveLiters) {
          Alert.alert('Error', 'Todas las vacas deben tener litros registrados');
          return;
        }

        const totalMassiveLiters = massiveCows.reduce((sum, c) => sum + parseFloat(c.liters), 0);

        await milkingsService.createMassiveMilking({
          ...baseData,
          cowIds: massiveCows.map(c => c.id),
          totalLiters: totalMassiveLiters,
        });
      }

      // Success
      Alert.alert(
        'Registro exitoso',
        'El ordeño ha sido registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.back();
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error registering milking:', err);
      Alert.alert('Error', err.message || 'Error al registrar el ordeño');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCowCount('25');
    setTotalLiters('180.5');
    setIndividualLiters('');
    setNotes('');
    setSelectedCow(null);
    setMassiveCows([]);
  };

  const handleCowSelection = (cow) => {
    if (selectedType === 'individual') {
      setSelectedCow(cow);
    }
  };

  const handleMassiveCowSelection = (cows) => {
    const cowsWithLiters = cows.map(cow => ({
      ...cow,
      liters: massiveCows.find(c => c.id === cow.id)?.liters || ''
    }));
    setMassiveCows(cowsWithLiters);
  };

  const updateMassiveCowLiters = (cowId, liters) => {
    setMassiveCows(massiveCows.map(cow =>
      cow.id === cowId ? { ...cow, liters } : cow
    ));
  };

  const removeMassiveCow = (cowId) => {
    setMassiveCows(massiveCows.filter(cow => cow.id !== cowId));
  };

  const TypeTab = ({ id, icon: Icon, title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.typeTab,
        isSelected && styles.typeTabSelected
      ]}
      onPress={onPress}
    >
      <Icon
        size={20}
        color={isSelected ? '#3B82F6' : '#6B7280'}
      />
      <Text style={[
        styles.typeTabText,
        isSelected && styles.typeTabTextSelected
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ShiftButton = ({ shift, icon: Icon, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.shiftButton,
        isSelected && styles.shiftButtonSelected
      ]}
      onPress={onPress}
    >
      <Icon
        size={24}
        color={isSelected ? '#FFFFFF' : '#6B7280'}
      />
      <Text style={[
        styles.shiftButtonText,
        isSelected && styles.shiftButtonTextSelected
      ]}>
        {shift}
      </Text>
    </TouchableOpacity>
  );

  const InputField = ({ label, value, onChangeText, placeholder, rightIcon: RightIcon, suffix }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={label.includes('Número') || label.includes('Litros') ? 'numeric' : 'default'}
        />
        {(RightIcon || suffix) && (
          <View style={styles.inputRight}>
            {RightIcon && <RightIcon size={20} color="#9CA3AF" />}
            {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <Stack.Screen
        options={{
          title: "Registro de Ordeño",
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Selection Tabs */}
          <View style={styles.typeContainer}>
            <View style={styles.typeTabsContainer}>
              <TypeTab
                id="rapid"
                icon={Zap}
                title="Rápido"
                isSelected={selectedType === 'rapid'}
                onPress={() => setSelectedType('rapid')}
              />
              <TypeTab
                id="individual"
                icon={User}
                title="Individual"
                isSelected={selectedType === 'individual'}
                onPress={() => setSelectedType('individual')}
              />
              <TypeTab
                id="massive"
                icon={List}
                title="Masivo"
                isSelected={selectedType === 'massive'}
                onPress={() => setSelectedType('massive')}
              />
            </View>
          </View>

          {/* Shift Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Turno</Text>
            <View style={styles.shiftContainer}>
              <ShiftButton
                shift="AM"
                icon={Sun}
                isSelected={selectedShift === 'AM'}
                onPress={() => setSelectedShift('AM')}
              />
              <ShiftButton
                shift="PM"
                icon={Moon}
                isSelected={selectedShift === 'PM'}
                onPress={() => setSelectedShift('PM')}
              />
            </View>
          </View>

          {/* Conditional Inputs based on type */}
          {selectedType === 'rapid' && (
            <>
              <InputField
                label="Número de Vacas"
                value={cowCount}
                onChangeText={setCowCount}
                placeholder="25"
                rightIcon={User}
              />
              <InputField
                label="Litros Totales"
                value={totalLiters}
                onChangeText={setTotalLiters}
                placeholder="180.5"
                suffix="L"
              />
            </>
          )}

          {selectedType === 'individual' && (
            <>
              {/* Cow Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Vaca Seleccionada</Text>
                <TouchableOpacity
                  style={styles.selectCowButton}
                  onPress={() => setShowCowSelector(true)}
                >
                  <User size={20} color="#6B7280" />
                  <Text style={[styles.selectCowText, selectedCow && styles.selectCowTextSelected]}>
                    {selectedCow ? `${selectedCow.cow_id || selectedCow.id}${selectedCow.name ? ` - ${selectedCow.name}` : ''} (${selectedCow.breed})` : 'Seleccionar vaca'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Liters Input */}
              <InputField
                label="Litros"
                value={individualLiters}
                onChangeText={setIndividualLiters}
                placeholder="28.5"
                suffix="L"
              />
            </>
          )}

          {selectedType === 'massive' && (
            <>
              {/* Add Cow Button */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Vacas ({massiveCows.length})</Text>
                <TouchableOpacity
                  style={styles.addCowButton}
                  onPress={() => setShowCowSelector(true)}
                >
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.addCowButtonText}>Agregar Vacas</Text>
                </TouchableOpacity>
              </View>

              {/* Massive Cows List */}
              {massiveCows.length > 0 && (
                <View style={styles.massiveCowsList}>
                  {massiveCows.map((cow) => (
                    <View key={cow.id} style={styles.massiveCowItem}>
                      <View style={styles.massiveCowInfo}>
                        <Text style={styles.massiveCowId}>
                          {cow.cow_id || cow.id}{cow.name ? ` - ${cow.name}` : ''}
                        </Text>
                        <Text style={styles.massiveCowBreed}>{cow.breed}</Text>
                      </View>
                      <View style={styles.massiveCowInput}>
                        <TextInput
                          style={styles.massiveCowLitersInput}
                          value={cow.liters}
                          onChangeText={(text) => updateMassiveCowLiters(cow.id, text)}
                          placeholder="0.0"
                          keyboardType="decimal-pad"
                        />
                        <Text style={styles.massiveCowLitersSuffix}>L</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeMassiveCow(cow.id)}
                        style={styles.removeCowButton}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Notes Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nota (Opcional)</Text>
            <View style={[styles.inputWrapper, styles.notesInputWrapper]}>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ej: Parte de la mañana, lluvia, observaciones..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegisterMilking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" />
                <Text style={styles.registerButtonText}>Registrar Ordeño</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Cow Selector Modal */}
        <CowSelector
          visible={showCowSelector}
          onClose={() => setShowCowSelector(false)}
          onSelect={selectedType === 'individual' ? handleCowSelection : handleMassiveCowSelection}
          selectedCows={selectedType === 'massive' ? massiveCows : (selectedCow ? [selectedCow] : [])}
          multiSelect={selectedType === 'massive'}
        />
      </KeyboardAvoidingView>
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
    top: 200,
    transform: [{ rotate: "-27.557deg" }, { scaleX: 2.5 }, { scaleY: 2.5 }],
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 5,
  },
  typeContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  typeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  typeTabSelected: {
    backgroundColor: '#EBF8FF',
  },
  typeTabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeTabTextSelected: {
    color: '#3B82F6',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  shiftContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shiftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  shiftButtonSelected: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },
  shiftButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  shiftButtonTextSelected: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  notesInputWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  notesInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSuffix: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  selectCowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectCowText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  selectCowTextSelected: {
    color: '#111827',
  },
  addCowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addCowButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  massiveCowsList: {
    marginTop: 12,
  },
  massiveCowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  massiveCowInfo: {
    flex: 1,
  },
  massiveCowId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  massiveCowBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  massiveCowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  massiveCowLitersInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minWidth: 80,
    textAlign: 'center',
  },
  massiveCowLitersSuffix: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  removeCowButton: {
    padding: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  bottomSpacing: {
    height: 40,
  },
});
