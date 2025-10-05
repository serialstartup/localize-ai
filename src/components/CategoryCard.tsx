import React, { memo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  textColor: string;
}

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  isSelected = false,
  style,
}) => {
  return (
    <TouchableOpacity 
      className="py-1 px-2 rounded-full mr-4 flex-row items-center shadow-sm min-h-[44px]" 
      style={[
        { 
          backgroundColor: isSelected ? category.textColor : category.color,
        },
        style
      ]}
      onPress={() => onPress?.(category)}
      activeOpacity={0.8}
    >
      <Text className="text-xl mr-2">{category.icon}</Text>
      <Text 
        className={`font-semibold text-sm ${isSelected ? 'text-white' : ''}`}
        style={{ 
          color: isSelected ? 'white' : category.textColor 
        }}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(CategoryCard);