import { Droplet, TriangleAlert } from "lucide-react-native";
import { View, Image, Text, StyleSheet  } from "react-native";

export default function CowCard({ cow }) {
  return (
    <View style={styles.cowCard}>
      <View style={styles.cowCardContent}>
        <Image source={{ uri: cow.image }} style={styles.cowImage} />

        <View style={styles.cowInfo}>
          <View style={styles.cowHeader}>
            <Text style={styles.cowId}>{cow.id}</Text>
            {cow.alert && (
              <View style={styles.alertBadge}>
                <TriangleAlert />
                <Text style={styles.alertText}>Atención</Text>
              </View>
            )}
          </View>

          <View style={styles.cowTags}>
            <View style={[styles.tag, { backgroundColor: cow.statusColor }]}>
              <Text style={styles.tagText}>{cow.status}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: cow.breedColor }]}>
              <Text style={[styles.tagText, { color: '#6B7280' }]}>{cow.breed}</Text>
            </View>
          </View>

          <View style={styles.cowStats}>
            <View style={styles.stat}>
              <Droplet />
              <Text style={styles.statText}>{cow.production}/día</Text>
            </View>
            <Text style={styles.ageText}>{cow.age}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cowCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  cowImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cowInfo: {
    flex: 1,
  },
  cowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cowId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  cowTags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  ageText: {
    fontSize: 14,
    color: '#6B7280',
  },
})