import { ComingSoon } from '@/components/ui';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Inventory() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ComingSoon
        title="Gestión de Inventario"
        description="El módulo de inventario está en desarrollo. Próximamente podrás gestionar productos, stock, movimientos y vencimientos."
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
