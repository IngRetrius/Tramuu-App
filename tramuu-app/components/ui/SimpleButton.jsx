import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

// Crear componentes animado
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SimpleButton({ onPress, addStylesButton, children }) {
  const buttonPressed = useSharedValue(0)
  const buttonOpacity = useSharedValue(0)

  // Estilo animado para el botón
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(buttonPressed.value, [0, 1], [1, 0.95]);

    return {
      opacity: buttonOpacity.value,
      transform: [{ scale }],
    }
  })

  // Handlers para el botón
  const handlePressIn = () => {
    buttonPressed.value = withSpring(1, {
      duration: 100,
      dampingRatio: 0.8,
    });
  };

  const handlePressOut = () => {
    buttonPressed.value = withSpring(0, {
      duration: 100,
      dampingRatio: 0.8,
    });
  };

  useEffect(() => {
    // Animación de entrada del botón (después del logo)
    buttonOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [buttonOpacity]);


  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.button, addStylesButton, buttonAnimatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold"
  }
})