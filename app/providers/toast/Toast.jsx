import React, { createContext, useContext, useRef, useState } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X as Close,
} from 'lucide-react-native';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const timeoutRef = useRef(null);

    // Animation refs
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-40)).current;

    const hide = () => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        Animated.timing(translateY, { toValue: -40, duration: 300, useNativeDriver: true }).start(() => {
            setToast(null);
        });
    };

    const show = ({ type = 'info', title, message, duration = 2500 }) => {
        // clear any existing
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setToast({ type, title, message });

        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();

        timeoutRef.current = setTimeout(hide, duration);
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}

            {toast && (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity,
                            transform: [{ translateY }],
                            backgroundColor: COLORS[toast.type].bg,
                        },
                    ]}
                >
                    <SafeAreaView>
                        <View style={styles.row}>
                            {ICONS[toast.type]}
                            <View style={styles.textWrap}>
                                {!!toast.title && (
                                    <Text style={[styles.title, { color: COLORS[toast.type].fg }]}>
                                        {toast.title}
                                    </Text>
                                )}
                                {!!toast.message && (
                                    <Text style={[styles.msg, { color: COLORS[toast.type].fg }]}>
                                        {toast.message}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity onPress={hide} hitSlop={10}>
                                <Close size={18} color={COLORS[toast.type].fg} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

// Hook
const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx.show;
};

/* ── visual styles ────────────────────────────────────────────── */
const COLORS = {
    success: { bg: '#DCFCE7', fg: '#15803D' },
    error: { bg: '#FEE2E2', fg: '#B91C1C' },
    warning: { bg: '#FEF9C3', fg: '#B45309' },
    info: { bg: '#DBEAFE', fg: '#1E3A8A' },
};

const ICONS = {
    success: <CheckCircle size={20} color={COLORS.success.fg} />,
    error: <XCircle size={20} color={COLORS.error.fg} />,
    warning: <AlertTriangle size={20} color={COLORS.warning.fg} />,
    info: <Info size={20} color={COLORS.info.fg} />,
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 13.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 2,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    textWrap: { flex: 1, marginLeft: 8 },
    title: { fontSize: 14, fontFamily: "bold" },
    msg: { fontSize: 12, marginTop: 2, fontFamily: "regular" },
});

export { ToastProvider, useToast }; 