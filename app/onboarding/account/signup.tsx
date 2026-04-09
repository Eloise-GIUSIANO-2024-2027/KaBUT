import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#F5F5F5' : '#1C1C1E';
    const inputBgColor = colorScheme === 'dark' ? '#2C2C2E' : '#FFFFFF';
    const buttonBgColor = colorScheme === 'dark' ? '#E5E5E5' : '#333333';
    const buttonTextColor = colorScheme === 'dark' ? '#1C1C1E' : '#F5F5F5';
    const errorColor = '#FF3B30';

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        setError('');
        setIsLoading(true);
        const result = await signup(email, password, name);
        setIsLoading(false);
        if (result.success) {
            router.push('/');
        } else if (result.error === 'emailExists') {
            setError('Un compte avec cet email existe déjà');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <ThemedText style={styles.title}>Créer un compte</ThemedText>
            <View style={[styles.formContainer, styles.formWrapper]}>
                <TextInput
                    style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                    placeholder="Nom"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                    placeholder="Mot de passe"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Pressable style={[styles.button, { backgroundColor: buttonBgColor }]} onPress={handleSubmit} disabled={isLoading}>
                    <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
                        {isLoading ? 'Chargement...' : "S'inscrire"}
                    </ThemedText>
                </Pressable>
                {error ? <ThemedText style={[styles.errorText, { color: errorColor }]}>{error}</ThemedText> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
    formWrapper: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});


