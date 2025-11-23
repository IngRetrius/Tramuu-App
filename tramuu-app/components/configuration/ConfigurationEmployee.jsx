import { Stack, useRouter } from 'expo-router';
import {
  Bell,
  Lock,
  LogOut,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
  Building2,
  IdCard
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAwareWrapper from '../KeyboardAwareWrapper';
import { InputField, ProfilePhoto, SettingItem, Tab, ToggleSwitch } from '../ui';
import { employeesService, authService } from '@/services';
import ChangePasswordModal from './ChangePasswordModal';

export default function ConfigurationEmployee() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('perfil');
  const [employeeName, setEmployeeName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Backend integration states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getProfile();

      setEmployeeName(data.name || '');
      setDocumentId(data.documentId || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setCompanyName(data.companyName || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!employeeName) {
        Alert.alert('Error', 'Por favor completa tu nombre');
        return;
      }

      setSaving(true);

      const profileData = {
        name: employeeName,
        documentId: documentId || undefined,
        phone: phone || undefined,
      };

      console.log('Sending profile data:', profileData);

      await employeesService.updateProfile(profileData);

      Alert.alert('Éxito', 'Los cambios han sido guardados exitosamente');

      loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'No se pudieron guardar los cambios';
      Alert.alert('Error', Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              // Still navigate to login even if logout fails
              router.replace('/login');
            }
          }
        }
      ]
    );
  };

  const renderPerfil = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadProfile();
          }} />
        }
      >
        {/* Foto de Perfil */}
        <View style={styles.card}>
          <ProfilePhoto
            name={employeeName || 'Empleado'}
            role="Lechero"
            company={companyName || 'Empresa'}
            onChangePhoto={() => Alert.alert("Cambiar Foto", "Funcionalidad para cambiar foto de perfil")}
          />
        </View>

        {/* Empresa Afiliada */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Empresa Afiliada</Text>
          <View style={styles.companyInfoContainer}>
            <Building2 size={24} color="#60A5FA" />
            <Text style={styles.companyNameText}>{companyName || 'No asignado'}</Text>
          </View>
        </View>

        {/* Información Personal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información Personal</Text>

          <InputField
            label="Nombre Completo"
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Tu nombre completo"
            icon={User}
          />

          <InputField
            label="CC/ID"
            value={documentId}
            onChangeText={setDocumentId}
            placeholder="Número de documento"
            icon={IdCard}
            keyboardType="numeric"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tu.email@ejemplo.com"
            icon={Mail}
            keyboardType="email-address"
            editable={false}
          />

          <InputField
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="+57 123 456 7890"
            icon={Phone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderConfiguracion = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Configuración de la Aplicación */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configuración de la Aplicación</Text>

        <SettingItem
          title="Notificaciones"
          subtitle="Recibe alertas importantes"
          icon={Bell}
          onPress={() => setNotifications(!notifications)}
          hasChevron={false}
          rightComponent={
            <ToggleSwitch
              isActive={notifications}
              onPress={() => setNotifications(!notifications)}
            />
          }
        />

        <SettingItem
          title="Modo Oscuro"
          subtitle="Cambia la apariencia de la app"
          icon={Settings}
          onPress={() => setDarkMode(!darkMode)}
          hasChevron={false}
          rightComponent={
            <ToggleSwitch
              isActive={darkMode}
              onPress={() => setDarkMode(!darkMode)}
            />
          }
        />
      </View>

      {/* Seguridad */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seguridad</Text>

        <SettingItem
          title="Cambiar Contraseña"
          subtitle="Actualiza tu contraseña"
          icon={Lock}
          onPress={() => setShowChangePasswordModal(true)}
        />

        <SettingItem
          title="Autenticación de Dos Factores"
          subtitle="Añade una capa extra de seguridad"
          icon={Shield}
          onPress={() => Alert.alert("2FA", "Funcionalidad en desarrollo")}
        />
      </View>

      {/* Cerrar Sesión */}
      <View style={styles.card}>
        <SettingItem
          title="Cerrar Sesión"
          subtitle="Salir de tu cuenta"
          icon={LogOut}
          onPress={handleLogout}
          iconColor="#EF4444"
          iconBackgroundColor="#FEE2E2"
        />
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <Stack.Screen options={{ title: "Mi Perfil" }} />
      <KeyboardAwareWrapper keyboardVerticalOffset={100}>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Tab
            id="perfil"
            title="Perfil"
            icon={User}
            isSelected={activeTab === 'perfil'}
            onPress={() => setActiveTab('perfil')}
          />
          <Tab
            id="configuracion"
            title="Configuración"
            icon={Settings}
            isSelected={activeTab === 'configuracion'}
            onPress={() => setActiveTab('configuracion')}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'perfil' && renderPerfil()}
          {activeTab === 'configuracion' && renderConfiguracion()}
        </View>

        {/* Change Password Modal */}
        <ChangePasswordModal
          visible={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      </KeyboardAwareWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
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
    elevation: 5,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  companyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    gap: 12,
  },
  companyNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
});