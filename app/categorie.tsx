import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, UiTokens } from '@/constants/theme';
import data from '@/constants/data.json';

const QUIZ_COLORS = ['#FF00FF', '#00E0E0', '#FF00FF', '#00E0E0'];

export default function CategorieScreen() {
    const scheme = useColorScheme() ?? 'light';
    const theme = Colors[scheme];
    const router = useRouter();
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

    const catId = Number(categoryId);
    const category = data.categories.find((c) => c.id === catId);

    const quizIds = data.relations
        .filter((r) => r.category_ids.includes(catId))
        .map((r) => r.quizz_id);

    const quizzes = data.quizzes.filter((q) => quizIds.includes(q.id));

    return (
        <ScrollView style={[styles.root, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Kabut</Text>
            <Text style={[styles.categoryName, { color: theme.text }]}>
                {category ? category.name : '[NOM DE LA CATEGORIE]'}
            </Text>

            <View style={styles.grid}>
                {quizzes.map((quiz, i) => (
                    <TouchableOpacity
                        key={quiz.id}
                        style={[styles.card, { borderColor: QUIZ_COLORS[i % QUIZ_COLORS.length] }]}
                        activeOpacity={0.75}
                        onPress={() => router.push({ pathname: '/quiz', params: { quizId: quiz.id } })}
                    >
                        <Text style={[styles.cardText, { color: theme.text }]}>{quiz.title}</Text>
                        <Text style={[styles.cardDifficulty, { color: QUIZ_COLORS[i % QUIZ_COLORS.length] }]}>
                            {quiz.difficulty}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
    categoryName: { fontSize: 15, fontWeight: '500', marginBottom: 20, opacity: 0.7 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: {
        width: '46%',
        height: 90,
        borderRadius: UiTokens.radiusDefault,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    cardText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
    cardDifficulty: { fontSize: 11, marginTop: 4, fontWeight: '500' },
});