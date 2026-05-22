import React, { useState } from 'react';

import {
    Text,
    View,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
// Removido: import { CalendarDays } from 'lucide-react-native';  <- pode não estar instalado
import { registerStyles as styles } from '../../styles/screens/registerStyles';
import { Input } from '../../components/Input';

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert('Erro', 'Você precisa aceitar os termos');
            return;
        }

        setLoading(true);
        try {
            const success = await register(name, email, password);
            if (success) {
                router.replace('/chat/select');
            } else {
                Alert.alert('Erro', 'Não foi possível criar a conta');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? -85 : 0}
            style={styles.container}
        >

            {/* BACKGROUND */}
            <Image
                source={require('../../assets/backgrounds/bg1.png')}
                style={styles.background}
                resizeMode="cover"
            />

            <View style={styles.content}>

                {/* LOGO */}
                <Image
                    source={require('../../assets/logos/logo_text.png')}
                    resizeMode='contain'
                    style={styles.logo}
                />

                {/* TITLE */}
                <Text style={styles.title}>
                    Crie uma nova conta!
                </Text>

                {/* INPUTS */}
                <View style={styles.inputContainer}>

                    {/* NAME */}
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/input_bg.png')}
                        style={styles.inputBackground}
                        imageStyle={styles.inputImage}
                    >
                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder='Seu nome'
                            placeholderTextColor="#777"
                            style={styles.input}
                        />
                    </ImageBackground>

                    {/* EMAIL */}
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/input_bg.png')}
                        style={styles.inputBackground}
                        imageStyle={styles.inputImage}
                    >
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder='seu@email.com'
                            placeholderTextColor="#777"
                            autoCapitalize='none'
                            keyboardType='email-address'
                            style={styles.input}
                        />
                    </ImageBackground>

                    {/* PASSWORD */}
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/input_bg.png')}
                        style={styles.inputBackground}
                        imageStyle={styles.inputImage}
                    >
                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder='Senha'
                            placeholderTextColor="#777"
                            secureTextEntry
                            style={styles.input}
                        />
                    </ImageBackground>

                    {/* CONFIRM PASSWORD */}
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/input_bg.png')}
                        style={styles.inputBackground}
                        imageStyle={styles.inputImage}
                    >
                        <Input
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder='Confirmar senha'
                            placeholderTextColor="#777"
                            secureTextEntry
                            style={styles.input}
                        />
                    </ImageBackground>

                    {/* DATE */}
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/input_bg.png')}
                        style={styles.inputBackground}
                        imageStyle={styles.inputImage}
                    >
                        <Input
                            value={birthDate}
                            onChangeText={(text) => {
                                const numeric = text.replace(/\D/g, '');
                                let formatted = numeric;
                                if (numeric.length > 2) formatted = numeric.slice(0, 2) + '/' + numeric.slice(2);
                                if (numeric.length > 4) formatted = numeric.slice(0, 2) + '/' + numeric.slice(2, 4) + '/' + numeric.slice(4, 8);
                                setBirthDate(formatted);
                            }}
                            placeholder='Data de nascimento (DD/MM/AAAA)'
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                            maxLength={10}
                            style={styles.input}
                        />
                    </ImageBackground>

                </View>

                {/* TERMS */}
                <TouchableOpacity
                    style={styles.termsRow}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                    <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                        {acceptedTerms && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text style={styles.termsText}>
                        Aceitar os{' '}
                        <Text style={styles.termsLink}>termos de uso</Text>
                    </Text>
                </TouchableOpacity>

                {/* REGISTER BUTTON */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <ImageBackground
                        source={require('../../assets/clay_backgrounds/green_bg.png')}
                        style={styles.registerButton}
                        imageStyle={styles.registerButtonImage}
                    >
                        <Text style={styles.registerButtonText}>
                            {loading ? 'Cadastrando...' : 'Cadastrar-se'}
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                {/* LOGIN LINK */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push('/auth/login')}
                >
                    <Text style={styles.loginText}>
                        Já possui uma conta?{' '}
                        <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}
