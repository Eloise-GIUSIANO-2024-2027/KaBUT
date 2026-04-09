import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Account() {
    const router = useRouter();

    return (
        <View style={styles.mainContainer}>
            <Pressable style={styles.button} onPress={() => router.push("/onboarding/account/login")}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push("/onboarding/account/signup")}>
                <Text style={styles.buttonText}>Créer un compte</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        padding: 16,
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 14,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 18,
    },
});


