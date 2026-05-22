// app/settings/index.tsx

import React from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';

import { useRouter } from 'expo-router';

import { Header } from '../../components/Header';

import { settingsStyles as styles } from '../../styles/screens/configStyles';

export default function Settings() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <Header />

            {/* CONTENT */}
            <View style={styles.content}>

                {/* SETTINGS ICON */}
                <Image
                    source={require('../../assets/buttons/config_icon.png')}
                    style={styles.settingsIcon}
                    resizeMode="contain"
                />

                {/* INFO BOX */}
                <View style={styles.infoBox}>

                    {/* NAME */}
                    <View style={styles.infoRow}>

                        <Text style={styles.infoText}>
                            Name: DogLover
                        </Text>

                        <TouchableOpacity activeOpacity={0.8}>
                            <Image
                                source={require('../../assets/pencil.png')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>

                    </View>

                    {/* EMAIL */}
                    <View style={styles.infoRow}>

                        <Text style={styles.infoText}>
                            Email: your@email.com
                        </Text>

                        <TouchableOpacity activeOpacity={0.8}>
                            <Image
                                source={require('../../assets/pencil.png')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>

                    </View>

                    {/* PASSWORD */}
                    <View style={styles.infoRow}>

                        <Text style={styles.infoText}>
                            Password: *****
                        </Text>

                        <TouchableOpacity activeOpacity={0.8}>
                            <Image
                                source={require('../../assets/pencil.png')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* CONTACT */}
                <View style={styles.contactBox}>

                    <Text style={styles.contactTitle}>
                        Contact us:
                    </Text>

                    <Text style={styles.contactEmail}>
                        Meetparrot@gmail.com
                    </Text>

                </View>

                {/* ACTIONS */}
                <View style={styles.actionsContainer}>

                    {/* SIGN OUT */}
                    {/* LOGOUT */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleLogout}
                        style={{ marginTop: 20, paddingHorizontal: 20 }}
                    >
                        <Text style={{ color: '#ff4d4d', fontSize: 16, fontWeight: '700' }}>
                            Sair da Conta
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View>
    );
}