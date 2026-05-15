import React from 'react';

import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Header } from '../../components/Header';

export default function SearchingScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>


                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push('/chat/select')}
                    style={styles.backButton}
                >
                    <Image
                        source={require('../../assets/buttons/back_bt.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/bg1.png')}
                style={styles.background}
                resizeMode="cover"
            />

            {/* CONTENT */}
            <View style={styles.content}>

                {/* TITLE */}
                <Text style={styles.title}>
                    Procurando por{'\n'}usuário
                </Text>

                {/* DOTS GIF */}
                <Image
                    source={require('../../assets/loading.gif')}
                    style={styles.dots}
                    resizeMode="contain"
                />

                {/* PARROT */}
                <Image
                    source={require('../../assets/logos/parrot_logo4.png')}
                    style={styles.parrot}
                    resizeMode="contain"
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#FFFFFF',
    },

    header: {
        zIndex: 9999,
        width: '100%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: '#fff',

        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 12,

        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,

        overflow: 'visible',
    },

    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: 50,
        height: 50,
    },

    background: {
        position: 'absolute',

        width: '100%',
        height: '100%',
    },

    content: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 24,
    },

    title: {
        textAlign: 'center',

        fontSize: 28,
        fontWeight: '800',

        color: '#6C63FF',

        lineHeight: 36,

        marginBottom: 20,
    },

    dots: {
        width: 130,
        height: 70,

        marginBottom: 70,
    },

    parrot: {
        width: 300,
        height: 300,
        marginBottom: 100,
    },
});