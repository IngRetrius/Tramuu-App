import { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import CowCard from './CowCard';
import PropTypes from 'prop-types';

/**
 * SwipeableCowCard Component
 * Wraps CowCard with swipe-to-delete functionality
 * @param {Object} cow - Cow data object
 * @param {Function} onDelete - Callback function when delete is confirmed
 */
export default function SwipeableCowCard({ cow, onDelete }) {
  const swipeableRef = useRef(null);

  /**
   * Handle delete action with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      'Eliminar Vaca',
      `¿Estás seguro de que deseas eliminar a ${cow.displayName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            // Close the swipeable
            swipeableRef.current?.close();
          },
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onDelete(cow.id);
            // Close the swipeable
            swipeableRef.current?.close();
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Render the delete action button
   */
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Animated.View style={[styles.deleteContent, { transform: [{ scale }] }]}>
            <Trash2 color="#FFFFFF" size={24} />
            <Text style={styles.deleteText}>Eliminar</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
    >
      <CowCard cow={cow} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightActionsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

// PropTypes for type checking
SwipeableCowCard.propTypes = {
  cow: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    production: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    alert: PropTypes.bool,
    statusColor: PropTypes.string.isRequired,
    breedColor: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
