import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function BackToButton({addStyles}) {
  return (
    <Pressable onPress={() => router.back()} style={[styles.backButton, addStyles]}>
      <ArrowLeft size={16} color="black" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 17,
    top: 50,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#60A5FA", // brand-blue equivalent
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
})