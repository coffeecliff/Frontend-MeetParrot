import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    scrollContent: {
        paddingBottom: 40,
    },

    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '800',
        color: colors.titlePrimary,
        marginTop: 24,
        marginBottom: 26,
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 60,
    },

    profileWrapper: {
        position: 'relative',
    },

    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 30,
    },

    editButton: {
        position: 'absolute',
        right: -4,
        bottom: -2,
    },

    editIcon: {
        width: 34,
        height: 34,
    },

    userInfo: {
        alignItems: 'center',
    },

    username: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.titlePrimary,
        marginBottom: 14,
    },

    coinBox: {
        width: 125,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    coinBoxImage: {
        borderRadius: 999,
    },

    coinIcon: {
        width: 24,
        height: 24,
        marginRight: 6,
    },

    coinText: {
        fontWeight: '700',
        color: colors.titlePrimary,
        fontSize: 20,
        marginBottom: 6,
    },

    plusText: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.titlePrimary,
        marginLeft: 8,
        marginTop: -2,
        marginBottom: 6,
    },

    section: {
        marginTop: 52,
        paddingHorizontal: 34,
    },

    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.titlePrimary,
    },

    infoIcon: {
        width: 18,
        height: 18,
        marginLeft: 6,
    },

    backgroundList: {
        flexDirection: 'row',
    },

    bgCard: {
        width: 92,
        height: 158,
        marginRight: 18,
        overflow: 'hidden',
    },

    bgCardImage: {
        borderRadius: 10,
    },

    selectedBgCard: {
        borderWidth: 4,
        borderColor: '#FFFFFF',
        borderRadius: 14,
    },

    checkIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
    },

    infoIconContainer: {
        width: 18,
        height: 18,
        borderRadius: 999,
        backgroundColor: '#B8AEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },

    infoIconText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
    },

    backgroundsContainer: {
        marginTop: 18,
    },

    backgroundsScroll: {
        paddingLeft: 4,
        paddingRight: 20,
    },

    backgroundCard: {
        width: 130,
        height: 190,
        borderRadius: 24,
        marginRight: 16,
        overflow: 'hidden',
        position: 'relative',
    },

    backgroundImage: {
        width: '100%',
        height: '100%',
    },

    // ==============================
    // MODAL
    // ==============================

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.18)',
    },

    modalContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderRadius: 28,
        paddingTop: 18,
        paddingHorizontal: 18,
        paddingBottom: 24,
    },

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    modalBackIcon: {
        width: 42,
        height: 42,
        marginRight: 10,
    },

    modalTitle: {
        color: colors.titlePrimary,
        fontSize: 22,
        fontWeight: '800',
        flex: 1,
    },

    // Saldo de moedas no canto direito do modal header
    modalCoinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F0FF',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 4,
    },

    modalCoinIcon: {
        width: 18,
        height: 18,
    },

    modalCoinText: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.titlePrimary,
    },

    // ==============================
    // GRID DE AVATARES
    // ==============================

    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    photoButton: {
        // sem margin aqui — gap cuida do espaçamento
    },

    // Container do avatar — POSITION RELATIVE para overlay funcionar
    photoImage: {
        width: 80,
        height: 80,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEE',
    },

    photoSelected: {
        borderWidth: 3,
        borderColor: '#7A7DF0',
    },

    photoImageStyle: {
        borderRadius: 18,
    },

    // ==============================
    // OVERLAY DE BLOQUEADO
    // Posicionado absolutamente SOBRE a imagem do avatar
    // ==============================

    lockedOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },

    priceBoxImage: {
        borderRadius: 20,
    },

    priceCoin: {
        width: 12,
        height: 12,
    },

    priceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
});
