import { AlertCircle, Clock, Wrench } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

/**
 * ComingSoon Component
 * 
 * Displays a "Coming Soon" / "En Desarrollo" message for features not yet implemented.
 * 
 * @param {Object} props
 * @param {string} props.title - Feature title (e.g., "Gestión de Inventario")
 * @param {string} props.description - Optional description
 * @param {string} props.variant - 'coming-soon' | 'in-development' | 'unavailable'
 * @param {Object} props.style - Additional styles
 */
export default function ComingSoon({ 
  title = "Funcionalidad en Desarrollo",
  description = "Esta funcionalidad estará disponible próximamente.",
  variant = 'coming-soon', // 'coming-soon' | 'in-development' | 'unavailable'
  style 
}) {
  const getIcon = () => {
    switch (variant) {
      case 'in-development':
        return <Wrench size={64} color="#F59E0B" />;
      case 'unavailable':
        return <AlertCircle size={64} color="#EF4444" />;
      default:
        return <Clock size={64} color="#60A5FA" />;
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'in-development':
        return '#F59E0B'; // Amber
      case 'unavailable':
        return '#EF4444'; // Red
      default:
        return '#60A5FA'; // Blue
    }
  };

  const getTitle = () => {
    switch (variant) {
      case 'in-development':
        return '🚧 En Construcción';
      case 'unavailable':
        return '⚠️ No Disponible';
      default:
        return '⏳ Próximamente';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <Text style={[styles.badge, { backgroundColor: getColor() }]}>
        {getTitle()}
      </Text>
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.footer}>
        <View style={[styles.statusDot, { backgroundColor: getColor() }]} />
        <Text style={styles.footerText}>
          {variant === 'in-development' 
            ? 'Trabajando en esta funcionalidad'
            : variant === 'unavailable'
            ? 'Temporalmente no disponible'
            : 'Estará disponible en una próxima versión'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.7,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
