import { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { cowsService } from '@/services';

const { width: screenWidth } = Dimensions.get('window');

export default function CowForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cowId: '',
    name: '',
    breed: 'Holstein',
    status: 'Lactante',
    dateOfBirth: '',
    notes: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log('handleSave called');

    // Validaciones
    if (!formData.cowId.trim()) {
      Alert.alert('Error', 'Por favor ingresa el ID de la vaca');
      return;
    }

    if (!formData.breed.trim()) {
      Alert.alert('Error', 'Por favor ingresa la raza');
      return;
    }

    try {
      setLoading(true);

      const cowData = {
        cowId: formData.cowId.trim(),
        name: formData.name.trim() || undefined,
        breed: formData.breed.trim(),
        status: formData.status,
        dateOfBirth: formData.dateOfBirth || undefined,
        notes: formData.notes.trim() || undefined,
      };

      console.log('Sending cow data:', cowData);

      const result = await cowsService.createCow(cowData);

      console.log('Cow created successfully:', result);

      Alert.alert(
        'Éxito',
        'Vaca agregada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/management')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating cow:', error);
      console.error('Error data:', JSON.stringify(error.data, null, 2));

      // El apiClient retorna error con estructura: { message, status, data }
      const errorMessage = error.data?.message || error.message || 'No se pudo agregar la vaca';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Vaca</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* ID de Vaca */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID de Vaca *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: V-001"
                value={formData.cowId}
                onChangeText={(value) => updateField('cowId', value)}
                autoCapitalize="characters"
              />
            </View>

            {/* Nombre (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Margarita"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
              />
            </View>

            {/* Raza */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raza *</Text>
              <View style={styles.breedButtons}>
                {['Holstein', 'Jersey', 'Normando', 'Otra'].map((breed) => (
                  <TouchableOpacity
                    key={breed}
                    style={[
                      styles.breedButton,
                      formData.breed === breed && styles.breedButtonSelected
                    ]}
                    onPress={() => updateField('breed', breed)}
                  >
                    <Text
                      style={[
                        styles.breedButtonText,
                        formData.breed === breed && styles.breedButtonTextSelected
                      ]}
                    >
                      {breed}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estado */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado *</Text>
              <View style={styles.statusButtons}>
                {['Lactante', 'Seca', 'Preñada'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.statusButtonSelected
                    ]}
                    onPress={() => updateField('status', status)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === status && styles.statusButtonTextSelected
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fecha de Nacimiento (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de Nacimiento (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD (Ej: 2020-05-15)"
                value={formData.dateOfBirth}
                onChangeText={(value) => updateField('dateOfBirth', value)}
              />
              <Text style={styles.hint}>Formato: AAAA-MM-DD</Text>
            </View>

            {/* Notas (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notas (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observaciones adicionales..."
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save color="#FFFFFF" size={20} />
                <Text style={styles.saveButtonText}>Guardar Vaca</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  breedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breedButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  breedButtonSelected: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },
  breedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  breedButtonTextSelected: {
    color: '#FFFFFF',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusButtonSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusButtonTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
