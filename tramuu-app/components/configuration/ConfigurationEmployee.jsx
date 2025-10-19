import { Stack } from 'expo-router';
import {
  Bell,
  Lock,
  Mail,
  Phone,
  Settings,
  Shield,
  Trash2,
  User
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAwareWrapper from '../KeyboardAwareWrapper';
import { InputField, ProfilePhoto, SettingItem, Tab, ToggleSwitch } from '../ui';

export default function ConfigurationEmployee() {
  const [activeTab, setActiveTab] = useState('perfil'); // perfil, configuracion
  const [userName, setUserName] = useState('José Rivera');
  const [email, setEmail] = useState('jose.rivera@finca.com');
  const [phone, setPhone] = useState('+57 321 654 9870');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleChangePhoto = () => {
    Alert.alert("Cambiar Foto", "Funcionalidad para cambiar foto de perfil");
  };

  const handleSaveProfile = () => {
    Alert.alert("Perfil Guardado", "Los cambios han sido guardados exitosamente");
  };

  const renderPerfil = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Foto de Perfil */}
      <View style={styles.card}>
        <ProfilePhoto
          name={userName}
          role="Lechero"
          company="Finca Santa María"
          onChangePhoto={handleChangePhoto}
        />
      </View>

      {/* Información Personal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información Personal</Text>
        
        <InputField
          label="Nombre Completo"
          value={userName}
          onChangeText={setUserName}
          placeholder="Tu nombre completo"
          icon={User}
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          icon={Mail}
        />

        <InputField
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          placeholder="+57 123 456 7890"
          icon={Phone}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

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
          onPress={() => Alert.alert("Cambiar Contraseña", "Funcionalidad en desarrollo")}
        />

        <SettingItem
          title="Autenticación de Dos Factores"
          subtitle="Añade una capa extra de seguridad"
          icon={Shield}
          onPress={() => Alert.alert("2FA", "Funcionalidad en desarrollo")}
        />
      </View>

      {/* Información de la Cuenta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de la Cuenta</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tipo de Cuenta</Text>
          <Text style={styles.infoValue}>Empleado</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Empresa</Text>
          <Text style={styles.infoValue}>Finca Santa María</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Estado</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Activo</Text>
          </View>
        </View>
      </View>

      {/* Acción Peligrosa */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cuenta</Text>
        
        <SettingItem
          title="Salir de la Empresa"
          subtitle="Desvincularte de esta empresa"
          icon={Trash2}
          onPress={() => Alert.alert("Salir de la Empresa", "¿Estás seguro de que quieres salir de esta empresa?")}
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
            title="Mi Perfil"
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});