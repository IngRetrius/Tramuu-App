import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ToggleSwitch({ isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.toggle, isActive && styles.toggleActive]}
      onPress={onPress}
    >
      <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#60A5FA',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});