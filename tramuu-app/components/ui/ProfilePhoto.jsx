import { Camera, User } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilePhoto({ 
  name, 
  role, 
  company, 
  onChangePhoto, 
  avatar = null 
}) {
  return (
    <View style={styles.profilePhotoSection}>
      <View style={styles.profilePhotoContainer}>
        <View style={styles.profilePhoto}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <User size={40} color="#9CA3AF" />
          )}
        </View>
        <TouchableOpacity style={styles.cameraButton} onPress={onChangePhoto}>
          <Camera size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileRole}>{role}</Text>
        <Text style={styles.profileCompany}>{company}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePhotoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '500',
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 12,
    color: '#6B7280',
  },
});