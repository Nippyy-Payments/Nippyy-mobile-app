import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { ArrowLeft, Calendar } from 'lucide-react-native'
import { useTheme } from '../../contexts/ThemeContext'
import { useToast } from '../../providers/toast/Toast'
import { ProgressSteps } from '../../components/ProgressSteps'
// This screen only collects DOB and passes it forward

export default function DateOfBirth({ navigation, route }) {
  const { theme } = useTheme()
  const toast = useToast()
  const { email, password, firstName, lastName } = route.params || {}

  const [date, setDate] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // DOB limits: between 13 and 120 years ago
  const today = new Date()
  const maxDob = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
  const minDob = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())

  const formatDate = (d) => {
    if (!d) return ''
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const onConfirm = (picked) => {
    // Enforce limits
    if (picked > maxDob || picked < minDob) {
      toast({ type: 'error', title: 'Invalid date', message: `Select a valid DOB between ${formatDate(minDob)} and ${formatDate(maxDob)}` })
      return
    }
    setPickerOpen(false)
    setDate(picked)
  }

  const onCancel = () => setPickerOpen(false)

  const handleSave = async () => {
    if (!date) {
      toast({ type: 'error', title: 'Select date', message: 'Please pick your date of birth' })
      return
    }
    setSaving(true)
    // Pass collected info forward to Country selection
    navigation.navigate('Country', {
      email,
      password,
      firstName,
      lastName,
      dob: formatDate(date),
    })
    setSaving(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: '#eee' }]}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft color={'#000'} size={18} />
      </TouchableOpacity>

       <ProgressSteps currentStep={3} totalSteps={5} />

      <View style={styles.header}>
        <Text style={styles.title}>Date of Birth</Text>
        <Text style={styles.subtitle}>Please select your date of birth</Text>
      </View>

      <View style={{margin:15}}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.9}
      >
        <Calendar color={theme.colors.primary} size={18} />
        <Text style={styles.pickerText}>{date ? formatDate(date) : 'YYYY-MM-DD'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: theme.colors.primary, opacity: saving ? 0.7 : 1 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={pickerOpen}
        mode="date"
        onConfirm={onConfirm}
        onCancel={onCancel}
        minimumDate={minDob}
        maximumDate={maxDob}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 10,
    margin:15
  },
  header: { marginBottom: 24 ,margin:15},
  title: { fontFamily: 'bold', fontSize: 24, color: '#000' },
  subtitle: { fontFamily: 'semi', fontSize: 14, color: '#666', marginTop: 6 },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickerText: { fontFamily: 'regular', color: '#111827', fontSize: 16 },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveText: { color: '#fff', fontFamily: 'semi', fontSize: 16 },
})