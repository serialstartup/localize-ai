import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownItem {
  id: string | number;
  label: string;
  value: any;
}

interface DropdownMenuProps {
  title?: string;
  items: DropdownItem[];
  selectedValue?: any;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  items,
  selectedValue,
  onSelect,
  placeholder = "Seçiniz",
  disabled = false,
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View style={style}>
      {title && (
        <Text className="text-gray-700 font-medium mb-2 text-base">
          {title}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={() => !disabled && setIsVisible(true)}
        className={`bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between ${disabled ? 'opacity-50' : ''}`}
        activeOpacity={0.7}
      >
        <Text className={`text-base ${selectedItem ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color="#9ca3af" 
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-50 justify-center px-6"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-2xl shadow-lg max-h-96">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900 text-center">
                {title || "Seçim Yapın"}
              </Text>
            </View>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`px-4 py-4 flex-row items-center justify-between ${
                    index < items.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-base ${
                    item.value === selectedValue ? 'text-purple-600 font-medium' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <Ionicons name="checkmark" size={20} color="#9333ea" />
                  )}
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              className="p-4 border-t border-gray-100"
              activeOpacity={0.7}
            >
              <Text className="text-center text-gray-500 font-medium">
                İptal
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownMenu;