import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Download } from 'lucide-react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../providers/toast/Toast';
import { theme } from '../../../theme/theme';

export default function ProfileQR() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useUser();
  const toast = useToast();
  const viewShotRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const tag = profile?.nippyy_tag || '';

  const handleSave = async () => {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        toast({ type: 'error', title: 'Permission denied', message: 'Allow Photos permission to save QR' });
        setSaving(false);
        return;
      }

      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('Could not capture QR');

      await MediaLibrary.saveToLibraryAsync(uri);
      toast({ type: 'success', title: 'Saved', message: 'QR code saved to your Photos' });
    } catch (e) {
      toast({ type: 'error', title: 'Save failed', message: e?.message || 'Could not save image' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My QR</Text>
        <View />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Scan to pay</Text>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.qrWrap}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 16 }}>
              <QRCodeStyled
                data={tag || 'nippyy'}
                style={{ backgroundColor: 'white' }}
                padding={20}
                pieceSize={5}
                isPiecesGlued={true}
                pieceBorderRadius={5}
                pieceCornerType='rounded'
              />
            </View>
          </ViewShot>


          <View>
          <Text style={styles.subtitle}>@{tag || 'No tag set yet'}</Text>
        </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]} onPress={handleSave} disabled={saving || !tag}>
            <Download size={16} color="#fff" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save to device'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    alignItems: 'center',
    gap: 12,
  },
  title: { fontFamily: 'bold', fontSize: 18 },
  subtitle: { fontFamily: 'regular', color: '#6b7280', marginBottom: 10 },
  qrWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 20, width: 300, height: 300,backgroundColor:theme.colors.primary,borderRadius:10 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  saveBtnText: { color: '#fff', fontFamily: 'semi' },
});
