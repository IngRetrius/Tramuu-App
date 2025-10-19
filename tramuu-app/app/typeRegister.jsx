import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { BackToButton, SimpleButton } from "@/components/ui";

export default function TypeRegister() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']} >
      <View style={styles.screen}>
        {/* Decorative black blobs */}
        <View style={styles.blob1Container}>
          <Svg
            width="70%"
            height="60%"
            viewBox="0 0 319 421"
            style={styles.blob1}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M52.4843 -34.4703C99.829 -26.0187 101.506 52.8974 142.429 79.2997C194.298 112.764 286.258 75.7754 312.877 133.526C337.695 187.369 275.402 244.498 240.469 291.999C214.093 327.862 178.651 353.348 138.787 370.244C105.208 384.475 69.1811 374.14 33.4307 379.745C-14.9563 387.331 -73.1843 445.812 -107.096 408.793C-143.037 369.559 -86.0708 304.865 -85.3112 250.122C-84.8546 217.212 -106.767 188.615 -103.587 155.858C-99.6089 114.89 -90.7013 73.4347 -65.128 42.2481C-34.1923 4.52207 6.06194 -42.7572 52.4843 -34.4703Z"
              fill="black"
            />
          </Svg>
        </View>

        <View style={styles.blob2Container}>
          <Svg
            width="80%"
            height="70%"
            viewBox="0 0 308 449"
            style={styles.blob2}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M276.584 5.43266C331.058 -6.16659 407.198 -2.03738 435.144 46.1396C467.312 101.596 389.508 171.402 408.393 232.668C423.273 280.939 503.794 281.073 522.077 328.16C542.735 381.364 539.199 446.205 510.451 495.51C480.218 547.362 424.635 584.995 365.699 596.36C308.513 607.387 250.13 584.211 199.474 555.474C155.676 530.628 114.056 494.13 100.169 445.728C87.4854 401.518 145.655 357.223 130.171 313.914C107.699 251.06 -7.84951 232.981 0.422978 166.745C7.47986 110.241 107.028 134.257 156.196 105.536C202.193 78.6687 224.483 16.5265 276.584 5.43266Z"
              fill="black"
            />
          </Svg>
        </View>

        <View style={styles.blob3Container}>
          <Svg
            width="40%"
            height="40%"
            viewBox="0 0 118 230"
            style={styles.blob3}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M93.7617 118.112C102.751 139.686 122.866 161.564 115.592 183.957C108.771 204.958 82.0782 206.705 63.0006 212.812C47.1333 217.892 30.8976 214.718 14.4674 216.331C-3.82149 218.127 -28.1717 239.268 -39.3585 222.862C-53.13 202.666 -29.2869 173.458 -32.0167 148.161C-33.3617 135.697 -50.7877 130.284 -50.7036 117.728C-50.6194 105.161 -35.51 99.3284 -31.6106 87.5536C-26.536 72.2301 -32.5614 53.8292 -24.9345 39.9143C-15.6675 23.0072 0.398295 -8.60061 15.037 2.44811C35.8346 18.1454 16.5745 61.59 32.5569 83.3067C41.2187 95.0762 60.3781 73.626 72.4889 80.5131C84.4643 87.3232 88.0576 104.423 93.7617 118.112Z"
              fill="black"
            />
          </Svg>
        </View>

        {/* Back button */}
        <BackToButton />

        {/* White card */}
        <View style={styles.card}>
          <Text style={styles.title}>Tipo de usuario</Text>

          <View style={styles.actions}>
            <SimpleButton
              onPress={() => router.push("/register/company")}
              addStylesButton={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Empresa</Text>
            </SimpleButton>

            <SimpleButton
              onPress={() => router.push("/register/employee")}
              addStylesButton={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Empleado</Text>
            </SimpleButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  screen: {
    display: "grid",
    placeContent: "center",
    height: "100%",
    backgroundColor: "#FFF",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  blob1Container: {
    position: "absolute",
    left: 0,
    top: 100,
    width: 300,
    height: 250,
    transform: [{ rotate: "2.6deg" }, { scaleX: 2 }, { scaleY: 2 }],
    zIndex: 0,
  },
  blob1: {
    width: "100%",
    height: "100%",
  },
  blob2Container: {
    position: "absolute",
    right: -140,
    top: 500,
    width: 320,
    height: 400,
    transform: [{ scaleX: 2.5 }, { scaleY: 3 }],
    zIndex: 0,
  },
  blob2: {
    width: "100%",
    height: "100%",
  },
  blob3Container: {
    position: "absolute",
    left: -250,
    bottom: -240,
    width: 160,
    height: 160,
    transform: [{ rotate: "90deg" }, { scaleX: 5 }, { scaleY: 4 }],
    zIndex: 0,
  },
  blob3: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: 300,
    borderRadius: 40,
    backgroundColor: "#FFF",
    padding: 24,
    paddingTop: 28,
    elevation: 2,
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  actions: {
    gap: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#60A5FA", // brand-blue equivalent
  },
  primaryBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
  },
});
