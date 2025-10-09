import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { ArrowLeft, Globe } from "lucide-react-native";
import { authService } from "../../services/authService";
import { sendWelcomeEmail } from "../../lib/api";
import { useToast } from "../../providers/toast/Toast";
import { theme } from "../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { ProgressSteps } from "../../components/ProgressSteps";

const COUNTRIES = [
  { name: "United States", code: "US", icon: "🇺🇸" },
  { name: "United Kingdom", code: "GB", icon: "🇬🇧" },
  { name: "Canada", code: "CA", icon: "🇨🇦" },
  { name: "Germany", code: "DE", icon: "🇩🇪" },
  { name: "France", code: "FR", icon: "🇫🇷" },
  { name: "Nigeria", code: "NG", icon: "🇳🇬" },
  { name: "Ghana", code: "GH", icon: "🇬🇭" },
  { name: "Kenya", code: "KE", icon: "🇰🇪" },
  { name: "South Africa", code: "ZA", icon: "🇿🇦" },
  { name: "Cameroon", code: "CM", icon: "🇨🇲" },
];

export default function SelectCountry({ route }) {
  //collect parent params
  const { email, password, firstName, lastName, dob } = route.params;

  const toast = useToast();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedCountry) {
      toast({
        type: "error",
        title: "Error",
        message: "Please select a country",
      });
      return;
    }

    setLoading(true);
    try {
      // reate the user account
      const { user } = await authService.signUp(email, password);

      if (user) {
        // update the user profile with country
        await authService.updateUserProfile(user.id, {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          account_location: selectedCountry?.code,
          date_of_birth: dob || null,
        });

        // Send welcome email
        try {
          await sendWelcomeEmail(email, firstName);
        } catch (emailError) {
          console.log("Failed to send welcome email:", emailError);
          // Don't show this error to the user since account creation was successful
        }

        toast({
          type: "success",
          title: "Success",
          message: "Account created successfully!",
        });

        // Ensure session is present; some email signups return no active session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          await supabase.auth.signInWithPassword({ email: email.trim(), password });
        }

        // Let AppNavigator switch to MainStack via auth state change
      }
    } catch (error) {
      console.log(error);
      toast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to create account",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: "#eee" }]}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft color={"#000"} size={18} />
      </TouchableOpacity>

      <ProgressSteps currentStep={5} totalSteps={5} />

      <View style={styles.header}>
        <Text style={styles.title}>Select Your Country</Text>
        <Text style={styles.subtitle}>
          Choose your country to complete registration
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      {/* Countries List */}
      <ScrollView
        style={styles.countriesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredCountries.map((country, index) => (
          <TouchableOpacity
            key={country.code}
            style={[
              styles.countryItem,
              selectedCountry?.code === country.code &&
                styles.selectedCountryItem,
            ]}
            onPress={() => setSelectedCountry(country)}
          >
            {/* Flag Emoji */}
            <Text style={styles.countryIcon}>{country.icon}</Text>

            {/* Country Name */}
            <Text
              style={[
                styles.countryName,
                selectedCountry?.code === country.code &&
                  styles.selectedCountryName,
              ]}
            >
              {country.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,

          (!selectedCountry || loading) && styles.submitButtonDisabled,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={handleSubmit}
        disabled={!selectedCountry || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Complete Registration</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 10,
    margin:15
  },
  header: {
    marginBottom: 30,
    margin:15
  },
  title: {
    fontSize: 24,
    color: "#000",
    marginBottom: 8,
    fontFamily: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "semi",
  },
  searchContainer: {
    marginBottom: 20,
    margin:15,
    marginTop:0
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontFamily: "regular",
  },
  countriesList: {
    flex: 1,
    marginBottom: 20,
    margin:15,
    marginTop:0
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countryIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "semi",
  },
  selectedCountryItem: {
    backgroundColor: "#f5faff",
  },
  selectedCountryName: {
    color: "#1976d2",
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    margin:15
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "semi",
  },
});
