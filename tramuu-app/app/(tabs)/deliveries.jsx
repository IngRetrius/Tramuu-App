import { ComingSoon } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function Deliveries() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ComingSoon
        title="Gestión de Entregas"
        description="El módulo de entregas está en desarrollo. Próximamente podrás registrar, programar y hacer seguimiento de tus entregas de leche."
        variant="in-development"
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
