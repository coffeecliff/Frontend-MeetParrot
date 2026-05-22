// app/profile/index.tsx

import React, { useState } from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Modal,
    Alert,
    Platform,
} from 'react-native';

import { Header } from '../../components/Header';
import { AnimalAvatar } from '../../components/AnimalAvatar';
import { profileStyles as styles } from '../../styles/screens/profileStyles';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useAvatarShop } from '../../context/AvatarShopContext';
import type { AvatarItem } from '../../context/AvatarShopContext';

// ==============================
// Alerta cross-platform
// Usa window.confirm no web (Alert.alert não existe no browser)
// ==============================
function crossAlert(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    if (Platform.OS === 'web') {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        if (confirmed) onConfirm();
        else onCancel?.();
    } else {
        Alert.alert(
            title,
            message,
            [
                { text: 'Cancelar', style: 'cancel', onPress: onCancel },
                { text: 'Confirmar', onPress: onConfirm },
            ]
        );
    }
}

function crossAlertInfo(title: string, message: string) {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}

export default function Profile() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const {
        equippedAvatar,
        avatars,
        purchasedIds,
        equipAvatar,
        buyAvatar,
        coins,
    } = useAvatarShop();

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const handleAvatarPress = (item: AvatarItem) => {
        const unlocked = purchasedIds.includes(item.id);

        if (unlocked) {
            equipAvatar(item.id);
            setShowProfilePopup(false);
            return;
        }

        if (coins < item.price) {
            crossAlertInfo('Moedas insuficientes', `Você precisa de ${item.price} moedas.`);
            return;
        }

        crossAlert(
            'Comprar avatar',
            `Deseja comprar este avatar por ${item.price} moedas?`,
            () => {
                const result = buyAvatar(item);
                if (result === 'ok') {
                    equipAvatar(item.id);
                    setShowProfilePopup(false);
                } else if (result === 'insufficient') {
                    crossAlertInfo('Moedas insuficientes', `Você precisa de ${item.price} moedas.`);
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

            {/* TITLE */}
            <Text style={styles.title}>Edit Profile</Text>

            {/* PROFILE AREA */}
            <View style={styles.profileRow}>

                {/* PROFILE IMAGE */}
                <View style={styles.profileWrapper}>

                    <AnimalAvatar
                        size={120}
                        source={equippedAvatar.image}
                        style={styles.profileImage}
                    />

                    {/* EDIT ICON */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.editButton}
                        onPress={() => setShowProfilePopup(true)}
                    >
                        <Image
                            source={require('../../assets/pencil.png')}
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>

                </View>

                {/* USER INFO */}
                <View style={styles.userInfo}>

                    <Text style={styles.username}>
                        {user?.username || 'Usuário'}
                    </Text>

                    {/* COINS */}
                    <TouchableOpacity
                        onPress={() => router.push('/coins')}
                        activeOpacity={0.8}
                    >
                        <ImageBackground
                            source={require('../../assets/clay_backgrounds/coin_bg.png')}
                            style={styles.coinBox}
                            imageStyle={styles.coinBoxImage}
                        >
                            <Image
                                source={require('../../assets/coin.png')}
                                style={styles.coinIcon}
                            />
                            <Text style={styles.coinText}>{coins}</Text>
                            <Text style={styles.plusText}>+</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                </View>

            </View>

            {/* BACKGROUND SELECT */}
            <View style={styles.section}>

                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Chat Background</Text>
                    <View style={styles.infoIconContainer}>
                        <Text style={styles.infoIconText}>i</Text>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.backgroundsScroll}
                >
                    <View style={styles.backgroundList}>
                        <TouchableOpacity activeOpacity={0.8}>
                            <ImageBackground
                                source={require('../../assets/backgrounds/default_bg.png')}
                                style={[styles.bgCard, styles.selectedBgCard]}
                                imageStyle={styles.bgCardImage}
                            >
                                <Image
                                    source={require('../../assets/check.png')}
                                    style={styles.checkIcon}
                                />
                            </ImageBackground>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8}>
                            <ImageBackground
                                source={require('../../assets/backgrounds/bg1.png')}
                                style={styles.bgCard}
                                imageStyle={styles.bgCardImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8}>
                            <ImageBackground
                                source={require('../../assets/backgrounds/green_bg.png')}
                                style={styles.bgCard}
                                imageStyle={styles.bgCardImage}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>

            

            {/* AVATAR POPUP */}
            <Modal visible={showProfilePopup} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setShowProfilePopup(false)}
                            >
                                <Image
                                    source={require('../../assets/buttons/back_bt.png')}
                                    style={styles.modalBackIcon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Select photo</Text>

                            {/* Saldo de moedas no modal */}
                            <View style={styles.modalCoinBadge}>
                                <Image
                                    source={require('../../assets/coin.png')}
                                    style={styles.modalCoinIcon}
                                />
                                <Text style={styles.modalCoinText}>{coins}</Text>
                            </View>
                        </View>

                        <View style={styles.photoGrid}>
                            {avatars.map((item) => {
                                const unlocked = purchasedIds.includes(item.id);
                                const selected = equippedAvatar.id === item.id;

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.8}
                                        style={styles.photoButton}
                                        onPress={() => handleAvatarPress(item)}
                                    >
                                        {/* Container relativo para posicionar overlay corretamente */}
                                        <View
                                            style={[
                                                styles.photoImage,
                                                selected && styles.photoSelected,
                                            ]}
                                        >
                                            <AnimalAvatar
                                                size={72}
                                                source={item.image}
                                                style={styles.photoImageStyle}
                                            />

                                            {/* Overlay de bloqueado — posicionado absolutamente SOBRE a imagem */}
                                            {!unlocked && (
                                                <View style={styles.lockedOverlay}>
                                                    <View style={styles.priceBox}>
                                                        <Image
                                                            source={require('../../assets/coin.png')}
                                                            style={styles.priceCoin}
                                                        />
                                                        <Text style={styles.priceText}>{item.price}</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}
