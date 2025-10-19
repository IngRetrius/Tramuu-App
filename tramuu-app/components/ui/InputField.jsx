import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  icon: Icon, 
  editable = true,
  ...textInputProps 
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {Icon && (
          <View style={styles.inputIcon}>
            <Icon size={20} color="#6B7280" />
          </View>
        )}
        <TextInput
          style={[styles.textInput, !editable && styles.textInputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          {...textInputProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  textInputDisabled: {
    color: '#9CA3AF',
  },
});