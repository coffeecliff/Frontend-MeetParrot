import React from 'react';
import { Text, View, Image } from 'react-native';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';
// import { useAuth } from '../../hooks/useAuth';
import { homeStyles as styles } from '../../styles/screens/homeStyles';

export default function Home() {
    const router = useRouter();
    // const { user, logout } = useAuth();
    const user = { username: 'Jeremias'}; // REMOVER DEPOIS DE FAZER O AUTH
    const handleStartChat = () => { router.push('/chat/select');}
    const handleAbout = () => { router.push('/about');}
    const handleLogout = () => { 
        // await Logout(); 
        router.replace('/auth/login');  // REMOVER DEPOIS DE FAZER O AUTH
}
    return (    
        <View style={styles.container}>  
            <View style={styles.header}>
                <Image source={require('../../assets/profile_icons/parrot.png')}
                    resizeMode='contain'
                    style={styles.logo}
                />
                <Text style={styles.welcome}>Bem-vindo, {user?.username || 'Stranger'} </Text>
                <Text style={styles.subtitle}>Pronto para se conectar com novas pessoas?</Text>
            </View>
        

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Meetstranger</Text>
                    <Text style={styles.cardDescription}>Converse com pessoas ao redor do mundo e encontre pessoas que gostam dos mesmos interesses que os seus!!!</Text>
                </View>

                <View style={styles.feature}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>💀</Text>
                        <Text style={styles.featureText}>Explore o mundo através do MeetStranger</Text>
                    </View>

                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>💀</Text> 
                        <Text style={styles.featureText}>Converse com pessoas ao redor do mundo de forma rápida e fácil</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttons}>
                <Button
                    title='Começar a Conversar'
                    onPress={() => { handleStartChat(); }}
                    style={styles.button}
                />
                <Button
                    title='Conheça mais sobre o app'
                    onPress={() => { handleAbout(); }}
                    style={styles.button}
                    variant='outline'
                />
                <Button
                    title='Sair'
                    onPress={() => { handleLogout(); }}
                    // style={}
                    variant='secondary'
                />
            </View>
        </View>  
    );
} 