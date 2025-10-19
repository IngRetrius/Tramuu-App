import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="employee" options={{ headerShown: false }} />
      <Stack.Screen name="company" options={{ headerShown: false }} />
    </Stack>
  );
}