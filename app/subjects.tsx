import Button from '@/components/login-components/button-shadow';
import ClassSlider from '@/components/login-components/slider';
import { router, Stack } from "expo-router";
import { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, TextInput, Image, Modal
} from "react-native";

// @ts-ignore
import TickGreen from '../assets/icons/tick-green.svg';
// @ts-ignore
import PlusSign from '../assets/icons/plus-sign.svg';

// ─── Subject Dictionary ───────────────────────────────────────────────────────
const CLASS_SUBJECTS: Record<number, string[]> = {
  5:  ["English", "Maths", "Science", "Social Studies", "Hindi", "Sanskrit", "Computer", "Other"],
  6:  ["English", "Maths", "Science", "Social Studies", "Hindi", "Sanskrit", "Computer", "Other"],
  7:  ["English", "Maths", "Science", "Social Studies", "Hindi", "Sanskrit", "Computer", "Other"],
  8:  ["English", "Maths", "Science", "SST", "Hindi", "Sanskrit", "Computer", "Other"],
  9:  ["English", "Maths", "Science", "Social Science", "Hindi", "Sanskrit", "Computer", "Other"],
  10: ["English", "Maths", "Science", "Social Science", "Hindi", "Sanskrit", "Computer", "Other"],
  11: ["Physics", "Chemistry", "Maths", "Biology", "English", "Computer Science",
       "Physical Education", "Economics", "Accountancy", "Business Studies",
       "History", "Geography", "Political Science", "Other"],
  12: ["Physics", "Chemistry", "Maths", "Biology", "English", "Computer Science",
       "Physical Education", "Economics", "Accountancy", "Business Studies",
       "History", "Geography", "Political Science", "Other"],
};

export default function SubjectScreen() {
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');

  const handleClassChange = (cls: number) => {
    setSelectedClass(cls);
    setSelectedSubjects([]);
    setCustomSubjects([]);
  };

  const toggleSubject = (subject: string) => {
    if (subject === 'Other') {
      setShowOtherInput(true);
      return;
    }
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleAddCustomSubject = () => {
    const trimmed = otherText.trim();
    if (trimmed && !customSubjects.includes(trimmed) && !selectedSubjects.includes(trimmed)) {
      setCustomSubjects((prev) => [...prev, trimmed]);
      setSelectedSubjects((prev) => [...prev, trimmed]);
    }
    setOtherText('');
    setShowOtherInput(false);
  };

  const subjects = CLASS_SUBJECTS[selectedClass] ?? [];

  // All chips = base subjects + any custom ones added
  const allSubjects = [
    ...subjects.filter(s => s !== 'Other'),
    ...customSubjects,
    ...(subjects.includes('Other') ? ['Other'] : []),
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Academic Snapshot</Text>
          <Text style={styles.subtitle}>Help us design the right path for your class.</Text>

          {/* Class Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What class are you in?</Text>
            <ClassSlider initialClass={8} onChange={handleClassChange} />
          </View>

          {/* Subject Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What subjects do you have?</Text>
            <View style={styles.chipsWrap}>
              {allSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                const isOther = subject === 'Other';
                return (
                  <TouchableOpacity
                    key={subject}
                    onPress={() => toggleSubject(subject)}
                    style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                    activeOpacity={0.7}
                  >
                    {isOther ? (
                      <Image
                        source={require('../assets/icons/others-pencil.png')}
                        style={styles.chipIconImg}
                      />
                    ) : isSelected ? (
                      <TickGreen width={24} height={24} />
                    ) : (
                      <PlusSign width={24} height={24} />
                    )}
                    <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Button */}
        <View style={styles.bottomBar}>
          <Button
            onPress={() => {
              console.log('class:', selectedClass);
              console.log('subjects:', selectedSubjects);
              router.push('./onboarding');
            }}
            label="Continue"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Other Subject Floating Input */}
      <Modal
        visible={showOtherInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOtherInput(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOtherInput(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKAV}
          >
            <TouchableOpacity activeOpacity={1} style={styles.inputCard}>
              <Text style={styles.inputLabel}>Add a subject</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. French, Drawing..."
                placeholderTextColor="#aaa"
                value={otherText}
                onChangeText={setOtherText}
                autoFocus
                onSubmitEditing={handleAddCustomSubject}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddCustomSubject}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  container: {
    alignItems: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontFamily: 'PelikanMedium',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PelikanMedium',
    color: '#808080',
    marginTop: 4,
  },
  section: {
    width: '100%',
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: 'PelikanMedium',
    fontSize: 16,
    color: '#000000',
    marginBottom: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#CEF1BB',
    borderColor: '#000000',
  },
  chipUnselected: {
    backgroundColor: '#E4CFFF',
    borderColor: '#000000',
  },
  chipIconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'PelikanMedium',
  },
  chipTextSelected: {
    color: '#000000',
  },
  chipTextUnselected: {
    color: '#000000',
  },
  bottomBar: {
    paddingHorizontal: 30,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: '#ffffff',
  },

  // ── Modal ──────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalKAV: {
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 12,
  },
  inputLabel: {
    fontFamily: 'PelikanMedium',
    fontSize: 16,
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5AFFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'PelikanMedium',
    fontSize: 14,
    color: '#000',
  },
  addBtn: {
    backgroundColor: '#7F77DD',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnText: {
    fontFamily: 'PelikanMedium',
    fontSize: 14,
    color: '#fff',
  },
});