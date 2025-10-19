import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SimpleButton } from '@/components/ui';

const imageLogo = require('../assets/images/tramuu-logo.webp');

// Crear componentes animados
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // Valores compartidos para las animaciones
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoTranslateY = useSharedValue(50);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  // Estilo animado para el logo
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [
        { scale: logoScale.value },
        { translateY: logoTranslateY.value }
      ],
    };
  });

  // Estilo animado para el botón
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: buttonTranslateY.value }],
    };
  });

  useEffect(() => {
    // Delay inicial para asegurar que el componente esté montado
    const timer = setTimeout(() => {
      // Animación del logo primero
      logoOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      });
      
      logoScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });

      logoTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      });

      // Animación del botón después del logo (con delay)
      buttonOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
        delay: 400,
      });

      buttonTranslateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.quad),
        delay: 400,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [buttonOpacity, buttonTranslateY, logoOpacity, logoScale, logoTranslateY]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <AnimatedImage
            style={[styles.image, logoAnimatedStyle]}
            source={imageLogo}
            resizeMode="contain"
          />
        </View>

        {/* Button */}
        <AnimatedView style={buttonAnimatedStyle}>
          <SimpleButton 
            onPress={() => router.push('/login')}
            addStylesButton={[styles.button, { marginBottom: insets.bottom + 20 }]}
          >
            <Text style={styles.buttonText}>Comenzar</Text>
            <ArrowRight size={19} color="black" />
          </SimpleButton>
        </AnimatedView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 226,
    height: 263,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderColor: '#71B7DC',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    paddingHorizontal: 80,
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
})



