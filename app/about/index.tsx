import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import React from 'react';
import { useRouter } from 'expo-router';
import { aboutStyles as styles } from '../../styles/screens/aboutStyles';
import { Menu } from '../../components/burger_menu';
import { Header } from '../../components/Header';

export default function About() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            
            {/* BACKGROUND (imagem decorativa) */}
            <Image
                source={require('../../assets/backgrounds/about_bg.png')} // 🔹 espaço 1
                style={styles.background}
                resizeMode="cover"
            />

            {/* HEADER */}
            <Header />

            <ScrollView contentContainerStyle={styles.content}>

                {/* LOGO PAPAGAIO */}
                <Image
                    source={require('../../assets/logos/about_logo.png')} // 🔹 espaço 4
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* TÍTULO */}
                <Text style={styles.title}>About us</Text>

                {/* TEXTO */}
                <Text style={styles.description}>
O Luis é maravilhoso
                </Text>

                <Text style={styles.description}>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>

            </ScrollView>
        </View>
    );
}