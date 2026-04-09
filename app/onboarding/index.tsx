import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

import OnboardingScreen1 from './components/OnboardingScreen1';
import OnboardingScreen2 from './components/OnboardingScreen2';
import OnboardingScreen3 from './components/OnboardingScreen3';

const { width, height } = Dimensions.get('window');

const screens = [
  { component: OnboardingScreen1, key: '1' },
  { component: OnboardingScreen2, key: '2' },
  { component: OnboardingScreen3, key: '3' },
];

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#F5F5F5';
  const dotActiveColor = colorScheme === 'dark' ? '#E5E5E5' : '#666666';
  const dotInactiveColor = colorScheme === 'dark' ? '#666666' : '#999999';
  const buttonBgColor = colorScheme === 'dark' ? '#E5E5E5' : '#333333';
  const buttonTextColor = colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5';

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current?.scrollToOffset({ offset: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    router.push('/onboarding/account');
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const isLastScreen = currentIndex === screens.length - 1;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.flatListContainer}>
        <FlatList
          ref={flatListRef}
          data={screens}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.screen, { backgroundColor, height }]}>
              <item.component />
            </View>
          )}
          keyExtractor={(item) => item.key}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          contentContainerStyle={styles.contentContainer}
        />
      </View>

      <View style={styles.pagination}>
        {screens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? dotActiveColor : dotInactiveColor },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBgColor }]}
          onPress={isLastScreen ? handleFinish : handleNext}
        >
          <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
            {isLastScreen ? 'Configurer le compte' : 'Suivant'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  flatListContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  screen: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  button: {
    margin: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: 'fit-content' as any
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
