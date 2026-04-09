import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function Index() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!currentUser) {
        return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/(tabs)" />;
}
