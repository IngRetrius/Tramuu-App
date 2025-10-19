import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { authService } from '@/services';

export default function ChangePasswordModal({ visible, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangePassword = async () => {
    try {
      // Validations
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (currentPassword === newPassword) {
        Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
        return;
      }

      setLoading(true);

      await authService.changePassword(currentPassword, newPassword);

      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido actualizada correctamente',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      const message = error.response?.data?.message || error.message || 'Error al cambiar la contraseña';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña Actual</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>Mínimo 6 caracteres</Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 4,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
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
