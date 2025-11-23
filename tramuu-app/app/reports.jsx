import { ComingSoon } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function Reports() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ComingSoon
        title="Reportes y Análisis"
        description="El módulo de reportes está en desarrollo. Próximamente podrás generar reportes detallados de producción, calidad, finanzas y más."
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
