import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

interface CategoryIconProps {
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, icon, selected, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={selected ? '#FFFFFF' : colors.text}
        />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: selected ? '#FFFFFF' : colors.text,
          },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    width: 100,
    height: 100,
    margin: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryIcon;