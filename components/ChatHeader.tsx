import React from 'react';

import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    ImageBackground,
} from 'react-native';

import { useRouter } from 'expo-router';

interface ChatRoomHeaderProps {
    partnerName?: string;
    onNext?: () => void;
}

export function ChatRoomHeader({
    partnerName = 'Ana Paula',
    onNext,
}: ChatRoomHeaderProps) {

    const router = useRouter();

    return (
        <View style={styles.header}>

            {/* LEFT SIDE */}
            <View style={styles.leftArea}>

                {/* BACK */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Image
                        source={require('../assets/buttons/back_bt.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                {/* PROFILE + NAME */}
                <View style={styles.profileArea}>

                    <Image
                        source={require('../assets/profile_icons/parrot.png')}
                        style={styles.profile}
                    />

                    <Text style={styles.name}>
                        {partnerName}
                    </Text>

                </View>

            </View>

            {/* NEXT BUTTON */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onNext}
            >
                <ImageBackground
                    source={require('../assets/clay_backgrounds/coin_bg.png')}
                    style={styles.nextButton}
                    imageStyle={styles.nextButtonImage}
                >

                    <Text style={styles.nextText}>
                        Próximo
                    </Text>

                    <Image
                        source={require('../assets/buttons/next_bt.png')}
                        style={styles.nextIcon}
                    />

                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        zIndex: 9999,

        width: '100%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',

        backgroundColor: '#FFFFFF',

        paddingTop: 25,
        paddingHorizontal: 12,
        paddingBottom: 12,

        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },

    leftArea: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

    backButton: {
        marginBottom: 10,
    },

    backIcon: {
        width: 50,
        height: 50,
    },

    profileArea: {
        flexDirection: 'row',
        alignItems: 'center',

        marginLeft: 4,
    },

    profile: {
        width: 42,
        height: 42,

        borderRadius: 999,

        marginRight: 8,
    },

    name: {
        color: '#7A7DF0',

        fontSize: 18,
        fontWeight: '800',
    },

    nextButton: {
        width: 130,
        height: 52,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    nextButtonImage: {
        borderRadius: 999,
    },

    nextText: {
        color: '#7A7DF0',

        fontSize: 18,
        fontWeight: '800',

        marginRight: 6,
    },

    nextIcon: {
        width: 30,
        height: 30,
    },
});