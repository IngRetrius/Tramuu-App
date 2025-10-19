import { KeyboardAvoidingView, Platform } from 'react-native'

const KeyboardAwareWrapper = ({ children, style, keyboardVerticalOffset = 0 }) => {
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView 
        style={[{ flex: 1 }, style]}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {children}
      </KeyboardAvoidingView>
    )
  }

  // Para Android, usar un enfoque más controlado
  return (
    <KeyboardAvoidingView 
      style={[{ flex: 1 }, style]}
      behavior="height"
      keyboardVerticalOffset={ keyboardVerticalOffset }
    >
      {children}
    </KeyboardAvoidingView>
  )
}

export default KeyboardAwareWrapper