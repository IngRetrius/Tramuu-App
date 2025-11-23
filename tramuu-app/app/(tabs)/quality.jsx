import { ComingSoon } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function Quality() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ComingSoon
        title="Control de Calidad"
        description="El módulo de control de calidad está en desarrollo. Próximamente podrás registrar pruebas de laboratorio, analizar temperatura, acidez y otros parámetros."
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
