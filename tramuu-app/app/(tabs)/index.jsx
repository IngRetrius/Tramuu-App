import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import { useUser } from '@/hooks/useUser';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const { userType, loading } = useUser();

  // Show loading state while determining user type
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  // Render appropriate dashboard based on user type
  if (userType === 'company') {
    return <CompanyDashboard />;
  } else if (userType === 'employee') {
    return <EmployeeDashboard />;
  }

  // Default to company dashboard if userType is not set
  return <CompanyDashboard />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});

