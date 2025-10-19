import { router } from "expo-router";
import { Bell, CirclePlus, ClipboardPlus } from "lucide-react-native";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function HeaderUser() {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => router.push("/configurationProfile")} style={styles.userInfo}>
          <Image
            source={{
              uri: "https://api.builder.io/api/v1/image/assets/TEMP/40731bff813067c3d5adf5dc52c6259f237a5ef2?width=64",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Lechero</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push("/reports")}>
            <ClipboardPlus />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/milkingRecord")}>
            <CirclePlus />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Bell />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFF",
    elevation: 2,
    paddingTop: 35,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(12, screenHeight * 0.015),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Math.max(8, screenWidth * 0.02),
  },
  avatar: {
    width: Math.max(32, screenWidth * 0.08),
    height: Math.max(32, screenWidth * 0.08),
    borderRadius: Math.max(16, screenWidth * 0.04),
  },
  headerTitle: {
    fontSize: Math.max(16, screenWidth * 0.038),
    fontWeight: "600",
    color: "#111827",
    lineHeight: Math.max(24, screenWidth * 0.057),
  },
  headerSubtitle: {
    fontSize: Math.max(11, screenWidth * 0.025),
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: Math.max(14, screenWidth * 0.033),
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
})

