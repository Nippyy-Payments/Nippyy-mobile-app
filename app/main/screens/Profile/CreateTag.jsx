import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../theme/theme";
import { ArrowLeft, Check,CircleCheck } from "lucide-react-native";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../providers/toast/Toast";

export default function CreateTag() {
  const navigation = useNavigation();
  const [tagName, setTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [tagStatus, setTagStatus] = useState(null);

  const { profile, loading: profileLoading } = useUser();
  const toast = useToast();

  // Validate and format tag input
  const handleTagInput = async (text) => {
    const formattedText = text.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setTagName(formattedText);

    // Reset status when user types
    setTagStatus(null);

    // Check availability if tag has content
    if (formattedText.length > 0) {
      checkTagAvailability(formattedText);
    }
  };

  // Check if tag is already taken
  const checkTagAvailability = async (tag) => {
    if (tag.length === 0) return;

    setIsCheckingAvailability(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("nippyy_tag", tag)
        .single();

      if (error && error.code === "PGRST116") {
        setTagStatus("available");
      } else if (data) {
        setTagStatus("taken");
      }
    } catch (error) {
      console.error("Error checking tag availability:", error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Save tag to Supabase
  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      toast({
        type: "error",
        title: "No Tag Name",
        message: "Please enter a tag name.",
      });
      return;
    }

    if (tagStatus === "taken") {
      toast({
        type: "error",
        title: "Oops!",
        message: "This tag is already taken",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userId = profile?.id;

      const { data, error } = await supabase
        .from("users")
        .update({
          nippyy_tag: tagName,
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }
      toast({
        type: "success",
        title: "yayyy 🎉",
        message: "Tag created successfully!",
      });
      navigation.goBack();
    } catch (error) {
       toast({
        type: "error",
        title: "Oops!",
        message: "Failed to create tag. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    if (isCheckingAvailability) {
      return <ActivityIndicator size="small" color={theme.colors.primary} />;
    }

    if (tagStatus === "available") {
      return <CircleCheck size={20} color="green" />;
    }

    if (tagStatus === "taken") {
      return <Text style={styles.takenText}>✕</Text>;
    }

    return null;
  };

  // Get status message
  const getStatusMessage = () => {
    if (tagStatus === "available") {
      return <Text style={styles.availableText}>Tag is available!</Text>;
    }

    if (tagStatus === "taken") {
      return <Text style={styles.takenMessage}>This tag is already taken</Text>;
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Tag</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Tag Name</Text>
        <Text style={styles.subtitle}>
          Only letters, numbers, and underscores allowed
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={tagName}
            onChangeText={handleTagInput}
            placeholder="mtchy_owo"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.statusIndicator}>{getStatusIndicator()}</View>
        </View>

        {getStatusMessage()}

        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor:
                tagName && tagStatus === "available"
                  ? theme.colors.primary
                  : "#cccccc",
            },
          ]}
          onPress={handleSaveTag}
          disabled={!tagName || tagStatus !== "available" || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Create Tag</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Tag Rules:</Text>
          <Text style={styles.ruleText}>
            • Only lowercase letters, numbers, and underscores
          </Text>
          <Text style={styles.ruleText}>• No spaces or special characters</Text>
          <Text style={styles.ruleText}>• Must be unique</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontFamily: "regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    fontFamily: "semi",
  },
  statusIndicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  availableText: {
    color: "green",
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 20,
  },
  takenText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  takenMessage: {
    color: "red",
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "bold",
  },
  rulesContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  rulesTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontFamily: "regular",
  },
});
