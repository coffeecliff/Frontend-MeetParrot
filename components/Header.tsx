import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';

import { useRouter, usePathname } from 'expo-router';
import { Menu } from '../components/burger_menu';

export function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const isChatSelect = pathname === '/chat/select';

    return (
        <View style={styles.header}>

            {isChatSelect ? (
                <Image
                    source={require('../assets/logos/logo_text.png')}
                    style={styles.logo}
                />
            ) : (
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
            )}

            <Menu />
        </View>
    );
}

const styles = StyleSheet.create({
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

    logo: {
        width: 160,
        height: 40,
    },

    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: 50,
        height: 50,
    },
});