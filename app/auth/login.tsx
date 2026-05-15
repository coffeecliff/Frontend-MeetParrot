import React, { useState } from 'react';

import {
    Text,
    View,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import { useRouter } from 'expo-router';

import { loginStyles as styles } from '../../styles/screens/loginStyles';

import { Input } from '../../components/Input';

// import { useAuth } from '../../hooks/useAuth';

export default function Login() {
    const router = useRouter();

    // const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, _setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            // const success = await Login(email, password);

            // if (success) {
            //     router.replace('/home');
            // } else {
            //     Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
            // }

            router.replace('/chat/select');
        } catch (error) {
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao tentar fazer login. Tente novamente.'
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? -85 : 0}
        >

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/bg1.png')}
                style={styles.background}
                resizeMode="cover"
            />

            <View style={styles.content}>

                {/* PARROT */}
                <Image
                    source={require('../../assets/logos/parrot_logo3.png')}
                    style={styles.parrot}
                    resizeMode='contain'
                />

                {/* LOGO */}
                <Image
                    source={require('../../assets/logos/logo_text.png')}
                    style={styles.logo}
                    resizeMode='contain'
                />

                {/* TITLE */}
                <Text style={styles.title}>
                    Login
                </Text>

                {/* INPUTS */}
                <View style={styles.inputContainer}>

                    {/* EMAIL */}
                    <View>

                        <ImageBackground
                            source={require('../../assets/clay_backgrounds/input_bg.png')}
                            style={styles.inputBackground}
                            imageStyle={styles.inputImage}

                        >
                            <Input
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize='none'
                                placeholder='seu@email.com'
                                placeholderTextColor="#777"
                                style={styles.input}
                            />
                        </ImageBackground>
                    </View>

                    {/* PASSWORD */}
                    <View>

                        <ImageBackground
                            source={require('../../assets/clay_backgrounds/input_bg.png')}
                            style={styles.inputBackground}
                            imageStyle={styles.inputImage}

                        >
                            <Input
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder='Senha'
                                placeholderTextColor="#777"
                                style={styles.input}
                            />
                        </ImageBackground>
                    </View>

                </View>

                {/* FORGOT PASSWORD */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.forgotButton}
                >
                    <Text style={styles.forgotText}>
                        Esqueci minha senha
                    </Text>
                </TouchableOpacity>

                {/* LOGIN BUTTON */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/green_bg.png')}
                        style={styles.loginButton}
                        imageStyle={styles.loginButtonImage}

                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Carregando...' : 'Entrar'}
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                {/* REGISTER */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push('/auth/register')}
                >
                    <Text style={styles.registerText}>
                        Não possui uma conta?{' '}
                        <Text style={styles.registerLink}>
                            Cadastre-se
                        </Text>
                    </Text>
                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}