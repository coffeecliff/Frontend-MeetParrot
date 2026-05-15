// app/coins/index.tsx

import React from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import { coinsStyles as styles } from '../../styles/screens/coinsStyles';

const coinPlans = [
    {
        id: 1,
        amount: '200 Coins',
        image: require('../../assets/coins/coin1.png'),
    },

    {
        id: 2,
        amount: '450 Coins',
        image: require('../../assets/coins/coin2.png'),
    },

    {
        id: 3,
        amount: '600 Coins',
        image: require('../../assets/coins/coin3.png'),
    },

    {
        id: 4,
        amount: '850 Coins',
        image: require('../../assets/coins/coin4.png'),
    },
];

export default function Coins() {

    return (
        <View style={styles.container}>

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/default_bg.png')}
                style={styles.background}
                resizeMode="cover"
            />

            <Header />

            {/* CONTENT */}
            <View style={styles.content}>

                {/* PARROT */}
                <Image
                    source={require('../../assets/logos/parrot_logo5.png')}
                    style={styles.parrot}
                    resizeMode="contain"
                />

                {/* COINS CARD */}
                <ImageBackground
                    source={require('../../assets/clay_backgrounds/coin_container.png')}
                    style={styles.card}
                    imageStyle={styles.cardImage}
                    resizeMode="stretch"
                >

                    {/* TITLE */}
                    <View style={styles.titleRow}>

                        <Text style={styles.title}>
                            Compre moedas!!!
                        </Text>

                        <Image
                            source={require('../../assets/buttons/back_bt.png')}
                            style={styles.infoIcon}
                        />

                    </View>

                    {/* COIN GRID */}
                    <View style={styles.grid}>

                        {coinPlans.map((item) => (

                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.8}
                                style={styles.coinButton}
                            >

                                <Text style={styles.coinAmount}>
                                    {item.amount}
                                </Text>

                                <Image
                                    source={item.image}
                                    style={styles.coinImage}
                                    resizeMode="contain"
                                />

                                <Text style={styles.price}>
                                    $$$
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </ImageBackground>

            </View>

            <Footer />

        </View>
    );
}