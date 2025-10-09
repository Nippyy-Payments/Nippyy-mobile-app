import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Modal,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useUser } from "../../../contexts/UserContext";
import { supabase } from "../../../lib/supabase";
import { useToast } from "../../../providers/toast/Toast";
import { imageUploadService } from "../../../services/imageUploadService";

export default function UserDetails() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const toast = useToast();
  const { profile } = useUser();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [dob] = useState(profile?.dob || profile?.date_of_birth || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.profile_image || "");

  const phoneVerified = profile?.phone_verified === true;

  // Bottom sheet modal for gender
  const [genderOpen, setGenderOpen] = useState(false);
  const genderOptions = useMemo(() => ["Male", "Female", "Other"], []);

  const initials = useMemo(() => {
    const f = (firstName || "").trim();
    const l = (lastName || "").trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || "U";
  }, [firstName, lastName]);

  const handleChangePhoto = async () => {
    try {
      const url = await imageUploadService.pickAndUpload();
      if (!url) return; // user canceled
      setAvatarUrl(url);
      const { error } = await supabase
        .from("users")
        .update({ profile_image: url })
        .eq("id", profile.id);
      if (error) {
        toast({ type: "error", title: "Error", message: error.message });
        return;
      }
      toast({ type: "success", title: "Updated", message: "Profile photo updated" });
    } catch (e) {
      toast({ type: "error", title: "Upload failed", message: e?.message || "Could not upload image" });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const update = {
        first_name: firstName,
        last_name: lastName,
        gender: gender || null,
      };

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("id", profile.id);

      setSaving(false);
      if (error) {
        toast({ type: "error", title: "Error", message: error.message });
        return;
      }
      toast({ type: "success", title: "Saved", message: "Profile updated" });
      navigation.goBack();
    } catch (e) {
      setSaving(false);
      toast({ type: "error", title: "Error", message: e?.message || "Failed to save" });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Information</Text>
        <View />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Centered Avatar with camera overlay */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.avatarCircle}
            onPress={handleChangePhoto}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
            <View style={styles.cameraBadge}>
              <Camera size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={false}
          placeholder="Email"
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, phoneVerified && styles.inputDisabled]}
          value={phone}
          editable={false}
          placeholder="Phone number"
        />
        {!phoneVerified && (
          <TouchableOpacity onPress={() => navigation.navigate('KycSteps')}>
            <Text style={styles.verifyText}>Verify your phone</Text>
          </TouchableOpacity>
        )}

        {/* DOB */}
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={dob || ''}
          editable={false}
          placeholder="YYYY-MM-DD"
        />

        {/* Gender with bottom sheet */}
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setGenderOpen(true)}>
          <Text style={styles.pickerText}>{gender || 'Select gender'}</Text>
        </TouchableOpacity>

        {/* bottom spacer so content isn't hidden behind fixed save bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed bottom Save bar */}
      <View style={styles.saveBar}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save changes'}</Text>
        </TouchableOpacity>
      </View>

      {/* Gender bottom sheet modal */}
      <Modal visible={genderOpen} transparent animationType="slide" onRequestClose={() => setGenderOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setGenderOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Select gender</Text>
          {genderOptions.map((g) => (
            <TouchableOpacity key={g} style={styles.sheetItem} onPress={() => { setGender(g); setGenderOpen(false); }}>
              <Text style={styles.sheetItemText}>{g}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.sheetItem, styles.sheetCancel]} onPress={() => setGenderOpen(false)}>
            <Text style={[styles.sheetItemText, { color: '#dc2626' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
   header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    resizeMode: 'cover',
  },
  avatarText: { fontFamily: 'bold', fontSize: 18, color: '#111827' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  label: {
    fontFamily: 'semi',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    fontFamily: 'regular',
    marginBottom: 14,
    color: '#111827',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  verifyText: {
    fontFamily: 'semi',
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: -8,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  pickerText: { fontFamily: 'regular', fontSize: 15, color: '#111827' },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom:20
  },
  saveBtnText: { color: '#fff', fontFamily: 'bold', fontSize: 15 },
  sheetBackdrop: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: { fontFamily: 'semi', fontSize: 16, marginBottom: 8 },
  sheetItem: { paddingVertical: 12 },
  sheetItemText: { fontFamily: 'regular', fontSize: 15 },
  sheetCancel: { marginTop: 4 },
});
