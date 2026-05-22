// app/coins/index.tsx

import React from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    Alert,
} from 'react-native';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAvatarShop } from '../../context/AvatarShopContext';
import { coinsStyles as styles } from '../../styles/screens/coinsStyles';

const coinPlans = [
    { id: 1, amount: 200,  label: '200 Coins',  image: require('../../assets/coins/coin1.png'), price: '$1.99' },
    { id: 2, amount: 450,  label: '450 Coins',  image: require('../../assets/coins/coin2.png'), price: '$3.99' },
    { id: 3, amount: 600,  label: '600 Coins',  image: require('../../assets/coins/coin3.png'), price: '$4.99' },
    { id: 4, amount: 850,  label: '850 Coins',  image: require('../../assets/coins/coin4.png'), price: '$6.99' },
];

function crossAlert(title: string, message: string, onConfirm: () => void) {
    if (Platform.OS === 'web') {
        if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
        Alert.alert(title, message, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Comprar', onPress: onConfirm },
        ]);
    }
}

export default function Coins() {
    const { addCoins, coins } = useAvatarShop();

    const handleBuy = (plan: typeof coinPlans[0]) => {
        crossAlert(
            'Comprar moedas',
            `Deseja comprar ${plan.label} por ${plan.price}?`,
            () => {
                addCoins(plan.amount);
                if (Platform.OS === 'web') {
                    window.alert(`✅ ${plan.label} adicionadas com sucesso!`);
                } else {
                    Alert.alert('Compra realizada!', `${plan.label} adicionadas ao seu saldo.`);
                }
            }
        );
    };

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

                        {/* Saldo atual */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Image
                                source={require('../../assets/coin.png')}
                                style={{ width: 18, height: 18 }}
                            />
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#333' }}>
                                {coins}
                            </Text>
                        </View>

                    </View>

                    {/* COIN GRID */}
                    <View style={styles.grid}>

                        {coinPlans.map((item) => (

                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.8}
                                style={styles.coinButton}
                                onPress={() => handleBuy(item)}
                            >

                                <Text style={styles.coinAmount}>
                                    {item.label}
                                </Text>

                                <Image
                                    source={item.image}
                                    style={styles.coinImage}
                                    resizeMode="contain"
                                />

                                <Text style={styles.price}>
                                    {item.price}
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
