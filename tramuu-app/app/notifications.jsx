import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronLeft,
  Clock,
  EllipsisVertical,
  Info,
  MoreHorizontal,
  Settings,
  Trash2,
  Truck,
  Users
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import KeyboardAwareWrapper from '../components/KeyboardAwareWrapper';
import { Stack } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('todas'); // todas, no_leidas, importantes
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      icon: AlertTriangle,
      color: '#EF4444',
      title: 'Temperatura Crítica',
      message: 'El tanque de refrigeración #2 ha superado los 8°C. Se requiere atención inmediata.',
      time: 'Hace 5 min',
      isRead: false,
      isImportant: true
    },
    {
      id: 2,
      type: 'delivery',
      icon: Truck,
      color: '#F59E0B',
      title: 'Entrega Retrasada',
      message: 'La entrega programada para las 9:00 AM con Juan Pérez lleva 2 horas de retraso.',
      time: 'Hace 15 min',
      isRead: false,
      isImportant: true
    },
    {
      id: 3,
      type: 'inventory',
      icon: AlertTriangle,
      color: '#F59E0B',
      title: 'Inventario Bajo',
      message: 'Alimento concentrado: Solo quedan 2 días de reserva. Es recomendable realizar un pedido.',
      time: 'Hace 1 hora',
      isRead: false,
      isImportant: false
    },
    {
      id: 4,
      type: 'info',
      icon: CheckCircle,
      color: '#10B981',
      title: 'Producción Completada',
      message: 'El ordeño matutino se ha completado exitosamente. Total: 1,420L.',
      time: 'Hace 2 horas',
      isRead: true,
      isImportant: false
    },
    {
      id: 5,
      type: 'user',
      icon: Users,
      color: '#60A5FA',
      title: 'Nuevo Lechero Agregado',
      message: 'Carlos Mendoza se ha unido al equipo como lechero. Dale la bienvenida.',
      time: 'Hace 3 horas',
      isRead: true,
      isImportant: false
    },
    {
      id: 6,
      type: 'system',
      icon: Info,
      color: '#6B7280',
      title: 'Actualización Disponible',
      message: 'Una nueva versión de la aplicación está disponible con mejoras de rendimiento.',
      time: 'Hace 1 día',
      isRead: true,
      isImportant: false
    },
    {
      id: 7,
      type: 'reminder',
      icon: Clock,
      color: '#8B5CF6',
      title: 'Recordatorio de Mantenimiento',
      message: 'Es hora de realizar el mantenimiento programado del equipo de ordeño.',
      time: 'Hace 2 días',
      isRead: true,
      isImportant: false
    }
  ]);

  const FilterButton = ({ filter, title, count, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.filterBadge, isSelected && styles.filterBadgeSelected]}>
          <Text style={[styles.filterBadgeText, isSelected && styles.filterBadgeTextSelected]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.isRead && styles.notificationUnread]}
      onPress={() => handleNotificationPress(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.notificationIcon, { backgroundColor: notification.color }]}>
          <notification.icon size={20} color="#FFFFFF" />
        </View>
        <View style={styles.notificationBody}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !notification.isRead && styles.notificationTitleUnread]}>
              {notification.title}
            </Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.notificationTime}>{notification.time}</Text>
              <TouchableOpacity 
                style={styles.notificationMenu}
                onPress={() => handleNotificationMenu(notification.id)}
              >
                <MoreHorizontal size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.notificationMessage, !notification.isRead && styles.notificationMessageUnread]}>
            {notification.message}
          </Text>
          {notification.isImportant && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantBadgeText}>Importante</Text>
            </View>
          )}
        </View>
      </View>
      {!notification.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'no_leidas':
        return notifications.filter(n => !n.isRead);
      case 'importantes':
        return notifications.filter(n => n.isImportant);
      default:
        return notifications;
    }
  };

  const getNotificationCounts = () => {
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      important: notifications.filter(n => n.isImportant).length
    };
  };

  const handleNotificationPress = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNotificationMenu = (id) => {
    Alert.alert(
      "Opciones de Notificación",
      "¿Qué deseas hacer?",
      [
        { text: "Marcar como no leída", onPress: () => handleMarkAsUnread(id) },
        { text: "Eliminar", style: "destructive", onPress: () => handleDeleteNotification(id) },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const handleMarkAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    Alert.alert("Notificaciones", "Todas las notificaciones han sido marcadas como leídas");
  };

  const handleClearAll = () => {
    Alert.alert(
      "Borrar Notificaciones",
      "¿Estás seguro de que quieres borrar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", style: "destructive", onPress: () => setNotifications([]) }
      ]
    );
  };

  const counts = getNotificationCounts();
  const filteredNotifications = getFilteredNotifications();

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <Stack.Screen options={{ title: "Notificaciones" }} />
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

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <FilterButton
              filter="todas"
              title="Todas"
              count={counts.total}
              isSelected={activeFilter === 'todas'}
              onPress={() => setActiveFilter('todas')}
            />
            <FilterButton
              filter="no_leidas"
              title="No leídas"
              count={counts.unread}
              isSelected={activeFilter === 'no_leidas'}
              onPress={() => setActiveFilter('no_leidas')}
            />
            <FilterButton
              filter="importantes"
              title="Importantes"
              count={counts.important}
              isSelected={activeFilter === 'importantes'}
              onPress={() => setActiveFilter('importantes')}
            />
          </ScrollView>
        </View>

        {/* Lista de Notificaciones */}
        <View style={styles.content}>
          {filteredNotifications.length > 0 ? (
            <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
              
              {/* Acciones de limpieza */}
              {filteredNotifications.length > 0 && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Borrar todas</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.bottomSpacing} />
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Bell size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No hay notificaciones</Text>
              <Text style={styles.emptyMessage}>
                {activeFilter === 'no_leidas' 
                  ? 'Todas las notificaciones han sido leídas'
                  : activeFilter === 'importantes'
                  ? 'No tienes notificaciones importantes'
                  : 'No tienes notificaciones en este momento'
                }
              </Text>
            </View>
          )}
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
    right: -50,
    top: -50,
    transform: [{ rotate: "-50deg" }, { scaleX: 2.4 }, { scaleY: 2 }],
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonSelected: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#60A5FA',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeSelected: {
    backgroundColor: '#FFFFFF',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterBadgeTextSelected: {
    color: '#60A5FA',
  },
  content: {
    flex: 1,
    zIndex: 5,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    position: 'relative',
  },
  notificationUnread: {
    borderLeftColor: '#60A5FA',
    backgroundColor: '#FEFEFE',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationBody: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    color: '#111827',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMenu: {
    padding: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMessageUnread: {
    color: '#374151',
  },
  importantBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  importantBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },
  actionsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});