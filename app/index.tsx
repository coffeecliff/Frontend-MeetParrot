import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

import { router } from 'expo-router';

import { welcomeStyles as styles } from '../styles/screens/welcomeStyles';

export default function Welcome() {
    // const { user } = useAuth();
    // useEffect(() => {
    //     if (user) {
    //         router.push('/home');
    //     }
    // }, [user, router]);
    return (
        <View style={styles.container}>

            {/* BACKGROUND */}
            <Image
                source={require('../assets/backgrounds/bg2.png')}
                style={styles.background}
                resizeMode="cover"
            />

            <View style={styles.content}>

                {/* LOGO */}


                {/* TITLE */}
                <Text style={styles.title}>
                    Bem-vindo ao
                </Text>
                <Image
                    source={require('../assets/logos/logo_text.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* PARROT */}
                <Image
                    source={require('../assets/logos/parrot_logo.png')}
                    style={styles.parrot}
                    resizeMode="contain"
                />

                {/* BUTTONS */}
                <View style={styles.buttonContainer}>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/auth/register')}
                    >
                        <ImageBackground
                            source={require('../assets/clay_backgrounds/green_bg.png')}
                            style={styles.button}
                            imageStyle={styles.buttonImage}
                        >
                            <Text style={styles.buttonText}>
                                Começar
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/auth/login')}
                    >
                        <ImageBackground
                            source={require('../assets/clay_backgrounds/green_bg.png')}
                            style={styles.button}
                            imageStyle={styles.buttonImage}
                         
                        >
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    );
}