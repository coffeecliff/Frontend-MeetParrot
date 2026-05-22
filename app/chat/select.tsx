import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';

import { useRouter } from 'expo-router';

import { chatSelectStyles as styles } from '../../styles/screens/chatSelectStyles';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

// IMPORTANTE: IDs em minúsculo para bater com o backend
// Backend aceita: 'movies' | 'games' | 'series' | 'books'
interface ChatCategory {
  id: string;
  name: string;
  online: string;
  icon: any;
}

const categories: ChatCategory[] = [
  {
    id: 'movies',       // <- lowercase, igual ao backend
    name: 'Movies',
    online: '80.000 people online',
    icon: require('../../assets/chat_icons/movies_icon.png'),
  },
  {
    id: 'games',        // <- lowercase, igual ao backend
    name: 'Games',
    online: '150.000 people online',
    icon: require('../../assets/chat_icons/games_icon.png'),
  },
  {
    id: 'series',       // <- lowercase, igual ao backend
    name: 'Series',
    online: '80.000 people online',
    icon: require('../../assets/chat_icons/series_icon.png'),
  },
  {
    id: 'books',        // <- lowercase, igual ao backend
    name: 'Books',
    online: '60.000 people online',
    icon: require('../../assets/chat_icons/books_icon.png'),
  },
];

export default function ChatSelect() {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/chat/room?category=${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND */}
      <Image
        source={require('../../assets/backgrounds/default_bg.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* HEADER */}
      <Header />

      {/* TITLE */}
      <Text style={styles.title}>Select your Chat!</Text>

      {/* GRID */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCategorySelect(item.id)}
            activeOpacity={0.8}
          >
            <Image source={item.icon} style={styles.cardIcon} />

            <Text style={styles.cardTitle}>{item.name}</Text>

            <Text style={styles.cardSubtitle}>
              {item.online}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}
