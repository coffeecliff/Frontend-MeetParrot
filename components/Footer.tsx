import React from 'react';

import {
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    Text,
    StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';

import { AnimalAvatar } from './AnimalAvatar';

import { useAvatarShop } from '../context/AvatarShopContext';

export function Footer() {
    const router = useRouter();

    const {
        equippedAvatar,
        coins,
    } = useAvatarShop();

    return (
        <View style={styles.footer}>

            {/* COINS */}
            <TouchableOpacity
                onPress={() => router.push('/coins')}
                activeOpacity={0.8}
            >
                <ImageBackground
                    source={require('../assets/clay_backgrounds/coin_bg.png')}
                    style={styles.coinBox}
                    imageStyle={styles.coinBoxImage}
                    resizeMode="stretch"
                >

                    <Image
                        source={require('../assets/coin.png')}
                        style={styles.coin}
                    />

                    <Text style={styles.coinText}>
                        {coins} +
                    </Text>

                </ImageBackground>
            </TouchableOpacity>

            {/* PROFILE */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/profile')}
            >

                <AnimalAvatar
                    size={60}
                    source={equippedAvatar.image}
                    style={styles.profile}
                />

            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,

        width: '100%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: '#fff',

        paddingHorizontal: 20,

        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 10,
    },

    coinBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        width: 125,
        height: 115,

        paddingHorizontal: 16,

        overflow: 'hidden',
    },

    coinBoxImage: {
        borderRadius: 999,
    },

    coin: {
        width: 25,
        height: 25,
        marginRight: 6,
    },

    coinText: {
        fontWeight: '700',
        color: '#7A7DF0',
        fontSize: 20,
        marginBottom: 6,
    },

    profile: {
        width: 60,
        height: 60,
        borderRadius: 99,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 10,
    },
});