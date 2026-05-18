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
} from 'react-native';

import { Header } from '../../components/Header';

import { profileStyles as styles } from '../../styles/screens/profileStyles';

import { useRouter } from 'expo-router';

import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
    const router = useRouter();

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();

        router.replace('/auth/login');
    };

    const [showProfilePopup, setShowProfilePopup] =
        useState(false);

    const profilePhotos = [
        {
            id: 1,
            image: require('../../assets/profile_icons/parrot.png'),
            unlocked: true,
        },

        {
            id: 2,
            image: require('../../assets/profile_icons/cat.png'),
            unlocked: true,
        },

        {
            id: 3,
            image: require('../../assets/profile_icons/dog.png'),
            unlocked: true,
        },

        {
            id: 4,
            image: require('../../assets/profile_icons/seal.png'),
            unlocked: true,
        },

        {
            id: 5,
            image: require('../../assets/profile_icons/bunny.png'),
            unlocked: false,
        },

        {
            id: 6,
            image: require('../../assets/profile_icons/bear.png'),
            unlocked: false,
        },

        {
            id: 7,
            image: require('../../assets/profile_icons/monke.png'),
            unlocked: false,
        },

        {
            id: 8,
            image: require('../../assets/profile_icons/racoon.png'),
            unlocked: false,
        },

        {
            id: 9,
            image: require('../../assets/profile_icons/tiger.png'),
            unlocked: false,
        },

        {
            id: 10,
            image: require('../../assets/profile_icons/plant.png'),
            unlocked: false,
        },
    ];

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
            <Text style={styles.title}>
                Edit Profile
            </Text>

            {/* PROFILE AREA */}
            <View style={styles.profileRow}>

                {/* PROFILE IMAGE */}
                <View style={styles.profileWrapper}>

                    <Image
                        source={require('../../assets/profile_icons/dog.png')}
                        style={styles.profileImage}
                    />

                    {/* EDIT ICON */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.editButton}
                        onPress={() =>
                            setShowProfilePopup(true)
                        }
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
                        DogLover
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

                            <Text style={styles.coinText}>
                                999
                            </Text>

                            <Text style={styles.plusText}>
                                +
                            </Text>

                        </ImageBackground>
                    </TouchableOpacity>

                </View>

            </View>

            {/* BACKGROUND SELECT */}
            <View style={styles.section}>

                <View style={styles.sectionTitleRow}>

                    <Text style={styles.sectionTitle}>
                        Chat Background
                    </Text>

                    <View style={styles.infoIconContainer}>
                        <Text style={styles.infoIconText}>
                            i
                        </Text>
                    </View>

                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.backgroundsScroll}
                >

                    <View style={styles.backgroundList}>

                        {/* SELECTED */}
                        <TouchableOpacity activeOpacity={0.8}>

                            <ImageBackground
                                source={require('../../assets/backgrounds/default_bg.png')}
                                style={[
                                    styles.bgCard,
                                    styles.selectedBgCard
                                ]}
                                imageStyle={styles.bgCardImage}
                            >

                                <Image
                                    source={require('../../assets/check.png')}
                                    style={styles.checkIcon}
                                />

                            </ImageBackground>

                        </TouchableOpacity>

                        {/* GREEN BG */}
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

            {/* LOGOUT */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                style={{ marginTop: 20 }}
            >
                <Text
                    style={{
                        color: '#ff4d4d',
                        fontSize: 16,
                        fontWeight: '700',
                        paddingRight: 100,
                    }}
                >
                    Sair da Conta
                </Text>
            </TouchableOpacity>

            {/* PROFILE PHOTO POPUP */}
            <Modal
                visible={showProfilePopup}
                transparent
                animationType="fade"
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        {/* TOP */}
                        <View style={styles.modalHeader}>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    setShowProfilePopup(false)
                                }
                            >
                                <Image
                                    source={require('../../assets/buttons/back_bt.png')}
                                    style={styles.modalBackIcon}
                                />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>
                                Select photo
                            </Text>

                        </View>

                        {/* PHOTO GRID */}
                        <View style={styles.photoGrid}>

                            {profilePhotos.map((item) => (

                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.8}
                                    style={styles.photoButton}
                                >

                                    <ImageBackground
                                        source={item.image}
                                        style={styles.photoImage}
                                        imageStyle={styles.photoImageStyle}
                                    >

                                        {!item.unlocked && (
                                            <View style={styles.lockedOverlay}>

                                                <ImageBackground
                                                    source={require('../../assets/profile_icons/blocked_overlay.png')}
                                                    style={styles.priceBox}
                                                    imageStyle={styles.priceBoxImage}
                                                >

                                                    <Image
                                                        source={require('../../assets/coin.png')}
                                                        style={styles.priceCoin}
                                                    />

                                                    <Text style={styles.priceText}>
                                                        150
                                                    </Text>

                                                </ImageBackground>

                                            </View>
                                        )}

                                    </ImageBackground>

                                </TouchableOpacity>

                            ))}

                        </View>

                    </View>

                </View>

            </Modal>

        </View>
    );
}