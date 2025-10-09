import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Check } from "lucide-react-native";
import { useUser } from "../../../contexts/UserContext";

// Configurable KYC flows by country
const kycFlows = {
  NG: [
    {
      id: 1,
      key: "phone_verified",
      title: "Phone Number",
      description: "Verify your phone number.",
      page: "VerifyPhone",
    },
    {
      id: 2,
      key: "bvn_verified",
      title: "BVN",
      description: "Verify your Bank Verification Number",
      page: "VerifyBvn",
    },
    {
      id: 4,
      key: "address_verified",
      title: "Proof of Address",
      description: "Upload address document",
      page: "verifyAddress",
    },
  ],
  US: [
    // Example placeholders; add keys/logic when implementing US flow
  ],
};

export default function KycSteps() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { profile, loading: profileLoading } = useUser();

  // user country
  const userCountry = "NG";

  // Get flow for user country, or fallback
  const steps = kycFlows[userCountry] || [];

  // Helper to determine if a step is completed from the user's profile
  const isStepCompleted = (step) => profile?.[step.key] === true;

  // Find the first incomplete step's index; if all complete, returns -1
  const firstIncompleteIdx = steps.findIndex((s) => !isStepCompleted(s));
  const nextStepIndex = firstIncompleteIdx === -1 ? steps.length : firstIncompleteIdx;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Know your customer</Text>
        <View />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            To access all of Nippyy's services we need to verify your identity in line with the requirements set by the CBN.
          </Text>
        </View>

        {steps.length > 0 ? (
          steps.map((step, index) => {
            const isCompleted = isStepCompleted(step);
            const isActive = index === nextStepIndex;
            const isLocked = index > nextStepIndex;

            return (
              <View key={step.id} style={styles.stepContainer}>
                {/* Left side: Node + line */}
                <View style={styles.nodeColumn}>
                  <View
                    style={[
                      styles.node,
                      isCompleted && styles.nodeCompleted,
                      isActive && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                      !isCompleted && !isActive && styles.nodeIncomplete,
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={14} color="#fff" />
                    ) : isActive ? (
                      <Text style={styles.nodeNumber}>{index + 1}</Text>
                    ) : (
                      <Text style={styles.nodeNumberInactive}>{index + 1}</Text>
                    )}
                  </View>
                  
                    <View 
                      style={[
                        styles.line,
                        isCompleted && styles.lineCompleted
                      ]}
                    />
                
                </View>
                {/* Right side: Step content */}
                <View style={styles.stepContent}>
                  <Text style={[ 
                    styles.stepTitle,
                    isCompleted ? styles.stepTitleCompleted : isLocked ? styles.stepTitleLocked : {}
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={[ 
                    styles.stepDescription,
                    isLocked && !isCompleted ? styles.stepDescriptionLocked : {}
                  ]}>
                    {step.description}
                  </Text>

                  {isCompleted && (
                    <View style={styles.completedPill}>
                      <Text style={styles.completedText}>Verified</Text>
                    </View>
                  )}

                  {isActive && (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() => navigation.navigate(step.page)}
                    >
                      <Text style={styles.buttonText}>
                        {step.id === 1 && !isCompleted ? "Verify" : "Start"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isLocked && !isCompleted && (
                    <View style={styles.pendingPill}>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}

                  {!isCompleted && !isActive && !isLocked && (
                    <View style={styles.notVerifiedPill}>
                      <Text style={styles.notVerifiedText}>Not Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: 16, color: "gray", textAlign: "center" }}>
              KYC steps for your country will be available soon.
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  descriptionContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  nodeColumn: {
    alignItems: "center",
    marginRight: 15,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  nodeCompleted: {
    backgroundColor: "green",
    borderColor: "green",
  },
  nodeIncomplete: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  nodeNumber: {
    fontSize: 10,
    fontFamily: "bold",
    color: "#fff",
  },
  nodeNumberInactive: {
    fontSize: 10,
    fontFamily: "bold",
    color: "#999",
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  lineCompleted: {
    backgroundColor: "green",
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333",
  },
  stepTitleCompleted: {
    color: "green",
  },
  stepTitleLocked: {
    color: "#999",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
    fontFamily: "regular",
  },
  stepDescriptionLocked: {
    color: "#999",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "bold",
  },
  completedPill: {
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "rgba(0, 128, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  completedText: {
    color: "green",
    fontSize: 10,
    fontFamily: "semi",
  },
  pendingPill: {
    borderWidth: 1,
    borderColor: "#F97316",
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  pendingText: {
    color: "#F97316",
    fontSize: 10,
    fontFamily: "semi",
  },
  notVerifiedPill: {
    borderWidth: 1,
    borderColor: "#DC2626",
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  notVerifiedText: {
    color: "#DC2626",
    fontSize: 10,
    fontFamily: "semi",
  },
  placeholder: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});