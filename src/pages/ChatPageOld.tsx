import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../constants/theme';

// Mock data for demonstration
const mockResponses = [
  {
    text: 'Here are some great coffee shops near you:',
    recommendations: [
      {
        name: 'Artisan Brew',
        image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        description: 'Cozy café with specialty coffee and pastries',
        distance: '0.3 miles',
        tags: ['Coffee', 'Pastries', 'Wifi']
      },
      {
        name: 'Morning Grind',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        description: 'Hip spot with pour-over options and light bites',
        distance: '0.5 miles',
        tags: ['Coffee', 'Breakfast', 'Hipster']
      }
    ]
  },
  {
    text: 'I found these parks nearby for a relaxing stroll:',
    recommendations: [
      {
        name: 'Riverside Gardens',
        image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        description: 'Beautiful waterfront park with walking paths',
        distance: '0.8 miles',
        tags: ['Park', 'Walking', 'Scenic']
      }
    ]
  }
];

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Hi! 👋 I'm your local discovery assistant. I can help you find amazing places nearby - just ask me what you're looking for!",
      timestamp: '01:03 PM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages([...messages, {
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
    setInputValue('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: randomResponse.text,
        recommendations: randomResponse.recommendations,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setMessages([...messages, {
          type: 'user',
          content: 'Voice input: Find me a coffee shop nearby',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }]);
        // Simulate response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'assistant',
            content: mockResponses[0].text,
            recommendations: mockResponses[0].recommendations,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }]);
        }, 1000);
      }, 3000);
    }
  };

  const handleImageUpload = () => {
    // Simulate image upload
    setMessages([...messages, {
      type: 'user',
      content: 'Image upload: Coffee cup',
      isImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'I found these coffee shops based on your image:',
        recommendations: mockResponses[0].recommendations,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
    }, 1500);
  };

  const renderMessage = ({ item: message, index }) => (
    <View key={index} style={{ 
      flexDirection: 'row', 
      marginBottom: Spacing.xl,
      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
      paddingHorizontal: Spacing.xs
    }}>
      {message.type === 'assistant' && (
        <View style={{
          width: 36,
          height: 36,
          borderRadius: BorderRadius.full,
          backgroundColor: Colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Spacing.sm,
          alignSelf: 'flex-end',
          marginBottom: Spacing.xs
        }}>
          <Text style={{ fontSize: 16, color: Colors.white }}>🤖</Text>
        </View>
      )}
      <View style={{
        maxWidth: message.type === 'user' ? '80%' : '75%',
        borderRadius: BorderRadius.xl,
        backgroundColor: message.type === 'user' ? Colors.primary : Colors.white,
        ...Shadows.md,
        overflow: 'hidden'
      }}>
        
        {message.isImage && (
          <View style={{ padding: Spacing.lg, paddingBottom: 0 }}>
            <Image 
              source={{ uri: message.imageUrl }} 
              style={{ 
                width: '100%', 
                height: 160, 
                borderRadius: BorderRadius.md,
                marginBottom: Spacing.md
              }}
              resizeMode="cover"
            />
          </View>
        )}
        
        <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md }}>
          <Text style={{ 
            color: message.type === 'user' ? Colors.white : Colors.gray900,
            fontSize: Typography.base,
            lineHeight: Typography.lineHeights.relaxed,
            fontWeight: Typography.normal
          }}>
            {message.content}
          </Text>
        </View>
        
        {message.timestamp && (
          <View style={{ 
            paddingHorizontal: Spacing.lg, 
            paddingBottom: Spacing.md
          }}>
            <Text style={{ 
              fontSize: Typography.xs, 
              color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : Colors.gray500,
              textAlign: message.type === 'user' ? 'right' : 'left'
            }}>
              {message.timestamp}
            </Text>
          </View>
        )}
        
        {message.recommendations && (
          <View style={{ padding: Spacing.lg, paddingTop: 0 }}>
            {message.recommendations.map((rec, idx) => (
              <TouchableOpacity key={idx} style={{
                backgroundColor: Colors.gray50,
                borderRadius: BorderRadius.lg,
                overflow: 'hidden',
                ...Shadows.sm,
                marginBottom: Spacing.md,
                borderWidth: 1,
                borderColor: Colors.gray100
              }} activeOpacity={0.95}>
                <Image 
                  source={{ uri: rec.image }} 
                  style={{ width: '100%', height: 140 }}
                  resizeMode="cover"
                />
                <View style={{
                  position: 'absolute',
                  top: Spacing.md,
                  right: Spacing.md,
                  backgroundColor: Colors.white,
                  borderRadius: BorderRadius.full,
                  padding: Spacing.sm,
                  ...Shadows.sm
                }}>
                  <Ionicons name="heart-outline" size={16} color={Colors.gray600} />
                </View>
                <View style={{ padding: Spacing.lg }}>
                  <Text style={{ 
                    fontWeight: Typography.bold, 
                    fontSize: Typography.lg,
                    color: Colors.gray900,
                    marginBottom: Spacing.xs
                  }}>
                    {rec.name}
                  </Text>
                  <Text style={{ 
                    fontSize: Typography.sm, 
                    color: Colors.gray600, 
                    lineHeight: Typography.lineHeights.relaxed,
                    marginBottom: Spacing.lg
                  }}>
                    {rec.description}
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: Spacing.md
                  }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      backgroundColor: Colors.accent + '15',
                      paddingHorizontal: Spacing.md,
                      paddingVertical: Spacing.sm,
                      borderRadius: BorderRadius.full
                    }}>
                      <Ionicons name="location" size={14} color={Colors.accent} />
                      <Text style={{ 
                        fontSize: Typography.sm, 
                        color: Colors.accent,
                        marginLeft: Spacing.xs,
                        fontWeight: Typography.medium
                      }}>
                        {rec.distance}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {rec.tags.map((tag, tagIdx) => (
                      <View key={tagIdx} style={{
                        backgroundColor: Colors.primary + '10',
                        paddingHorizontal: Spacing.md,
                        paddingVertical: Spacing.sm,
                        borderRadius: BorderRadius.full,
                        marginRight: Spacing.sm,
                        marginBottom: Spacing.xs,
                        borderWidth: 1,
                        borderColor: Colors.primary + '20'
                      }}>
                        <Text style={{ 
                          fontSize: Typography.xs, 
                          color: Colors.primary,
                          fontWeight: Typography.semibold
                        }}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {message.type === 'user' && (
        <View style={{
          width: 32,
          height: 32,
          borderRadius: BorderRadius.full,
          backgroundColor: Colors.gray200,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: Spacing.sm,
          alignSelf: 'flex-end',
          marginBottom: Spacing.xs
        }}>
          <Text style={{ fontSize: 14, color: Colors.gray600 }}>👤</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray50 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            padding: Spacing.xl,
            paddingBottom: Spacing['2xl']
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <View style={{ 
          backgroundColor: Colors.white, 
          ...Shadows.lg,
          paddingTop: Spacing.xl,
          paddingBottom: Platform.OS === 'ios' ? Spacing['2xl'] : Spacing.xl,
          paddingHorizontal: Spacing.xl,
          borderTopWidth: 1,
          borderTopColor: Colors.gray100
        }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: Colors.gray50, 
            borderRadius: BorderRadius.xl, 
            paddingHorizontal: Spacing.md, 
            paddingVertical: Spacing.sm,
            minHeight: 44,
            borderWidth: 1,
            borderColor: Colors.gray200
          }}>
            <TouchableOpacity 
              onPress={toggleRecording} 
              style={{ 
                marginRight: Spacing.sm,
                padding: Spacing.xs,
                borderRadius: BorderRadius.full,
                backgroundColor: isRecording ? Colors.error + '15' : 'transparent'
              }}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isRecording ? 'mic' : 'mic-outline'} 
                size={20} 
                color={isRecording ? Colors.error : Colors.gray600} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleImageUpload} 
              style={{ 
                marginRight: Spacing.sm,
                padding: Spacing.xs,
                borderRadius: BorderRadius.full
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="image-outline" size={20} color={Colors.gray600} />
            </TouchableOpacity>
            
            <TextInput
              style={{ 
                flex: 1, 
                backgroundColor: 'transparent', 
                borderWidth: 0, 
                fontSize: Typography.base,
                color: Colors.gray900,
                paddingVertical: Spacing.sm,
                maxHeight: 80,
                minHeight: 20
              }}
              placeholder="Yakındaki yerleri keşfet..."
              placeholderTextColor={Colors.gray500}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
              multiline={true}
            />
            
            <TouchableOpacity 
              onPress={handleSend} 
              disabled={!inputValue.trim()}
              style={{
                backgroundColor: inputValue.trim() ? Colors.primary : Colors.gray300,
                borderRadius: BorderRadius.full,
                padding: Spacing.sm,
                marginLeft: Spacing.xs,
                ...Shadows.sm
              }}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={inputValue.trim() ? Colors.white : Colors.gray500} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;