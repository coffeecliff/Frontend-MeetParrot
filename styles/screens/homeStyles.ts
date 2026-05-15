import { StyleSheet } from "react-native";
import { colors } from '../../constants/colors';
import { BorderRadius, Shadows, Spacing } from "../../design-system/tokens/spacing";
import { LineHeights, TextStyles } from "../../design-system/tokens/typography";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: Spacing.xl,
    },
    header: {
        paddingTop: Spacing['4xl'],
        paddingBottom: Spacing.xl,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xl,
        borderRadius: BorderRadius['2xl'],
        shadowRadius: 20,
        shadowColor: colors.shadow,
        marginHorizontal: 'auto',
    },
    welcome: {
        ...TextStyles.title,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: Spacing.xs,
        letterSpacing: -0.1,
        lineHeight: 24,
    },
    subtitle: {
        ...TextStyles.caption,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    content: {
        flex: 1
    },
    card: {
        backgroundColor: colors.surface,
        padding: Spacing.xl,
        borderRadius: BorderRadius.lg,
    },
    cardTitle: {
        ...TextStyles.title,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: Spacing.md,
        letterSpacing: -0.2
    },
    cardDescription:{
        ...TextStyles.caption,
        color: colors.textSecondary,
        lineHeight:20,
    },
    feature: {
        alignItems: 'center'
    },
    featureIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    featureText: {
        ...TextStyles.small,
        color: colors.primary,
        fontWeight: '500',
    },
    buttons: {
        paddingBottom: Spacing['4xl'],
    },
    button: {
        marginBottom: Spacing.sm
    }

});
 
