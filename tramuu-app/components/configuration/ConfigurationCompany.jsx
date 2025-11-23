import { Stack, useRouter } from 'expo-router';
import {
  Bell,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Settings,
  Shield,
  Trash2,
  User,
  Users,
  Copy
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAwareWrapper from '../KeyboardAwareWrapper';
import { InputField, ProfilePhoto, SettingItem, Tab, ToggleSwitch } from '../ui';
import { companiesService, employeesService, authService } from '@/services';
import ChangePasswordModal from './ChangePasswordModal';

export default function ConfigurationCompany() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('perfil'); // perfil, lecheros, configuracion
  const [companyName, setCompanyName] = useState('');
  const [companyNit, setCompanyNit] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [adminName, setAdminName] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Backend integration states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [invitationCode, setInvitationCode] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'lecheros') {
      loadEmployees();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await companiesService.getProfile();

      setCompanyName(data.name || '');
      setCompanyNit(data.nit || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setAdminName(data.adminName || data.ownerName || '');
      setInvitationCode(data.invitationCode || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil de la empresa');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getEmployees();
      
      // Ensure employees is always an array
      let employeesList = [];
      if (Array.isArray(data)) {
        employeesList = data;
      } else if (data && Array.isArray(data.employees)) {
        employeesList = data.employees;
      }
      
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'No se pudieron cargar los empleados');
      setEmployees([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const EmployeeCard = ({ employee }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <View style={styles.employeeAvatar}>
          {employee.avatar ? (
            <Image source={{ uri: employee.avatar }} style={styles.avatarImage} />
          ) : (
            <User size={24} color="#9CA3AF" />
          )}
        </View>
        <View style={styles.employeeDetails}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeRole}>{employee.role}</Text>
          <Text style={styles.employeeEmail}>{employee.email}</Text>
        </View>
      </View>
      <View style={styles.employeeActions}>
        <View style={[styles.statusBadge, { backgroundColor: employee.isActive ? '#10B981' : '#F59E0B' }]}>
          <Text style={styles.statusText}>{employee.isActive ? 'Activo' : 'Inactivo'}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => handleEmployeeAction(employee.id)}>
          <MoreHorizontal size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleEmployeeAction = (employeeId) => {
    Alert.alert(
      "Acciones del Empleado",
      "Selecciona una acción",
      [
        {
          text: "Desactivar",
          onPress: async () => {
            try {
              await employeesService.updateEmployee(employeeId, { isActive: false });
              Alert.alert('Éxito', 'Empleado desactivado correctamente');
              loadEmployees();
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo desactivar el empleado');
            }
          }
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            Alert.alert(
              'Confirmar eliminación',
              '¿Estás seguro de eliminar este empleado?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await employeesService.deleteEmployee(employeeId);
                      Alert.alert('Éxito', 'Empleado eliminado correctamente');
                      loadEmployees();
                    } catch (error) {
                      Alert.alert('Error', error.message || 'No se pudo eliminar el empleado');
                    }
                  }
                }
              ]
            );
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const handleAddEmployee = async () => {
    try {
      if (!invitationCode) {
        // Generate new code
        const data = await companiesService.generateInvitationCode();
        setInvitationCode(data.code || data.invitationCode);
      }

      Alert.alert(
        "Código de Invitación",
        `Comparte este código con el nuevo empleado:\n\n${invitationCode}`,
        [
          {
            text: "Copiar",
            onPress: async () => {
              await Clipboard.setStringAsync(invitationCode);
              Alert.alert('Copiado', 'Código copiado al portapapeles');
            }
          },
          { text: "Cerrar" }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo generar el código de invitación');
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Cambiar Foto", "Funcionalidad para cambiar foto de perfil");
  };

  const handleSaveProfile = async () => {
    try {
      // Validate required fields
      if (!companyName) {
        Alert.alert('Error', 'Por favor completa el nombre de la empresa');
        return;
      }

      setSaving(true);

      const profileData = {
        name: companyName,
        nit: companyNit || undefined,
        phone: phone || undefined,
        address: address || undefined,
      };

      console.log('Sending profile data:', profileData);

      await companiesService.updateProfile(profileData);

      Alert.alert('Éxito', 'Los cambios han sido guardados exitosamente');

      // Reload profile to get updated data
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
            name={adminName || 'Usuario'}
            role="Administrador"
            company={companyName || 'Empresa'}
            onChangePhoto={handleChangePhoto}
          />
        </View>

        {/* Información de la Empresa */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de la Empresa</Text>

          <InputField
            label="Nombre de la Empresa"
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Nombre de la finca"
            icon={User}
          />

          <InputField
            label="NIT/ID"
            value={companyNit}
            onChangeText={setCompanyNit}
            placeholder="NIT o ID de la empresa"
            icon={User}
          />

          <InputField
            label="Email Corporativo"
            value={email}
            onChangeText={setEmail}
            placeholder="email@empresa.com"
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

          <InputField
            label="Dirección"
            value={address}
            onChangeText={setAddress}
            placeholder="Dirección de la finca"
            icon={MapPin}
          />
        </View>

        {/* Código de Invitación */}
        {invitationCode && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Código de Invitación</Text>
            <View style={styles.invitationCodeContainer}>
              <Text style={styles.invitationCodeText}>{invitationCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={async () => {
                  await Clipboard.setStringAsync(invitationCode);
                  Alert.alert('Copiado', 'Código copiado al portapapeles');
                }}
              >
                <Copy size={20} color="#60A5FA" />
              </TouchableOpacity>
            </View>
            <Text style={styles.invitationCodeHint}>
              Comparte este código con nuevos empleados para que se unan a tu empresa
            </Text>
          </View>
        )}

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

  const renderLecheros = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.loadingText}>Cargando empleados...</Text>
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
            loadEmployees();
          }} />
        }
      >
        {/* Header con botón agregar */}
        <View style={styles.employeesHeader}>
          <View>
            <Text style={styles.employeesTitle}>Usuarios / Lecheros</Text>
            <Text style={styles.employeesSubtitle}>Gestiona los usuarios de tu finca</Text>
          </View>
          <TouchableOpacity style={styles.addEmployeeButton} onPress={handleAddEmployee}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addEmployeeText}>Invitar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de empleados */}
        {!Array.isArray(employees) || employees.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Sin empleados</Text>
            <Text style={styles.emptyText}>
              Invita a tu primer empleado usando el botón &quot;Invitar&quot;
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.employeesContainer}>
              {employees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </View>
          </View>
        )}

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

      {/* Zona de Peligro */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Zona de Peligro</Text>
        
        <SettingItem
          title="Eliminar Cuenta"
          subtitle="Eliminar permanentemente tu cuenta"
          icon={Trash2}
          onPress={() => Alert.alert("Eliminar Cuenta", "Esta acción no se puede deshacer")}
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
      <Stack.Screen options={{ title: "Configuración" }} />
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
            id="lecheros"
            title="Lecheros"
            icon={Users}
            isSelected={activeTab === 'lecheros'}
            onPress={() => setActiveTab('lecheros')}
          />
          <Tab
            id="configuracion"
            title="Config"
            icon={Settings}
            isSelected={activeTab === 'configuracion'}
            onPress={() => setActiveTab('configuracion')}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'perfil' && renderPerfil()}
          {activeTab === 'lecheros' && renderLecheros()}
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
  employeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  employeesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  employeesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  addEmployeeButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addEmployeeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  employeesContainer: {
    gap: 16,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '500',
    marginBottom: 2,
  },
  employeeEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  employeeActions: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  invitationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 8,
  },
  invitationCodeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  invitationCodeHint: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
});