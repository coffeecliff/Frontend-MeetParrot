import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
} from 'react-native';

import { useRouter, usePathname } from 'expo-router';

export function Menu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    function toggleMenu() {
        setOpen(!open);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleMenu}
                style={styles.menuButton}
            >
                <Image
                    source={require('../assets/buttons/menu_bt.png')}
                    style={styles.menuIcon}
                />
            </TouchableOpacity>

            {open && (
                <>
                    <View style={styles.whiteSquare} />

                    <View style={styles.dropdown}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push('/about')}
                        >
                            <Image
                                source={require('../assets/buttons/about_icon.png')}
                                style={styles.buttonIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push('/settings')}
                        >
                            <Image
                                source={require('../assets/buttons/config_icon.png')}
                                style={styles.buttonIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'visible',
    },

    menuIcon: {
        width: 50,
        height: 50,
        zIndex: 1000,
    },

    menuButton: {
        zIndex: 999999,
        elevation: 999999,
    },

    whiteSquare: {
        position: 'absolute',

        top: 30,
        right: -20,

        width: 92,
        height: 40,

        backgroundColor: '#FFFFFF',

        zIndex: 999,
        elevation: 99999,
    },

    dropdown: {
        position: 'absolute',

        top: 62,
        right: -20,

        backgroundColor: '#FFFFFF',

        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,

        paddingTop: 10,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,

        gap: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,

        elevation: 9999,
        zIndex: 998,
    },



    buttonIcon: {
        width: 60,
        height: 60,
        zIndex: 1000,
        borderRadius: 999,
    },


    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
});