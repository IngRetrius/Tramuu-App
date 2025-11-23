import { ComingSoon } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function Notifications() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ComingSoon
        title="Notificaciones"
        description="El sistema de notificaciones está en desarrollo. Recibirás alertas importantes sobre producción, calidad, entregas y más."
        variant="coming-soon"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
