import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, UiTokens } from '@/constants/theme';
import data from '@/constants/data.json';

const CATEGORY_COLORS = ['#FF00FF', '#00E0E0', '#FF00FF', '#00E0E0'];

function generateStats() {
    const totalQuizzes = data.quizzes.length;
    const quizDone = Math.floor(Math.random() * (totalQuizzes + 1));
    const successRate = Math.floor(Math.random() * 101);
    const avgCorrect = Math.floor(Math.random() * 101);
    return { successRate, quizDone, totalQuizzes, avgCorrect };
}

const stats = generateStats();

export default function MenuScreen() {
    const scheme = useColorScheme() ?? 'light';
    const theme = Colors[scheme];
    const router = useRouter();

    const handleCategoryPress = (categoryId: number) => {
        router.push({ pathname: '/categorie', params: { categoryId } });
    };

    return (
        <ScrollView style={[styles.root, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Kabut</Text>

            <Text style={[styles.sectionLabel, { color: theme.text }]}>Categorie</Text>
            <View style={styles.grid}>
                {data.categories.map((cat, i) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.card, { borderColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }]}
                        activeOpacity={0.75}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        <Text style={[styles.cardText, { color: theme.text }]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.sectionLabel, { color: theme.text }]}>Mes Stats</Text>
            <View style={styles.statsRow}>
                <View style={[styles.statBox, { borderColor: theme.primary }]}>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{stats.successRate}%</Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>réussites</Text>
                </View>
                <View style={[styles.statBox, { borderColor: theme.secondary }]}>
                    <Text style={[styles.statValue, { color: theme.secondary }]}>{stats.quizDone}/ {stats.totalQuizzes}</Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>quizz fait</Text>
                </View>
                <View style={[styles.statBox, { borderColor: theme.primary }]}>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{stats.avgCorrect} %</Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>réponse juste en moyenne</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
    },
    card: {
        width: '46%',
        height: 80,
        borderRadius: UiTokens.radiusDefault,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    statBox: {
        borderWidth: 1.5,
        borderRadius: UiTokens.radiusButton,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 80,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
});