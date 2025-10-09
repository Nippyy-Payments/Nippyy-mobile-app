import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  AtSign,
  ChevronRight,
  CreditCard,
  Landmark,
  Copy,
  Share,
  X,
} from "lucide-react-native";
import { useToast } from "../../../providers/toast/Toast";
import { useUser } from "../../../contexts/UserContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Addmoney() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showTagModal, setShowTagModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  //user data object from context
  const { profile, loading: profileLoading } = useUser();

  const toast = useToast();

  // dummy user tag
  const userTag = profile?.nippyy_tag||'No tag yet!';

  //open screen function
  const openScreen = (screen) => {
    navigation.navigate(screen);
  };

  const openTagModal = () => {
    setShowTagModal(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeTagModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTagModal(false);
    });
  };

  const copyToClipboard = () => {
    toast({
      type: "success",
      title: "Copied!",
      message: "Your Nippyy tag has been copied to clipboard.",
    });
  };

  const shareTag = () => {
    // Implement share functionality here
    Alert.alert("Share", "Share functionality would be implemented here");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
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
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.optionWrapper}
            onPress={() => openScreen("AccountDetails")}
          >
            <View style={styles.innerLeftIconWrapper}>
              <Landmark size={18} color={"#0B0D47"} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.topText}>Bank Transfer</Text>
              <Text style={styles.lowerText}>Add money via bank transfer.</Text>
            </View>
            <View>
              <ChevronRight size={20} color={"grey"} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionWrapper} onPress={openTagModal}>
            <View style={styles.innerLeftIconWrapper}>
              <AtSign size={18} color={"#0B0D47"} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.topText}>Share my Nippyy Tag</Text>
              <Text style={styles.lowerText}>
                Share your unique tag instantly.
              </Text>
            </View>
            <View>
              <ChevronRight size={20} color={"grey"} />
            </View>
          </TouchableOpacity>

          {/*Coming Soon feature*/}
          <View>
            <TouchableOpacity style={styles.optionWrapper} disabled>
              <View style={styles.innerLeftIconWrapper}>
                <CreditCard size={18} color={"#0B0D47"} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.topText}>Top up with card</Text>
                <Text style={styles.lowerText}>
                  Use your debit or credit card.
                </Text>
              </View>
              <View>
                <ChevronRight size={20} color={"grey"} />
              </View>
            </TouchableOpacity>
            <View style={styles.comingSoonPill}>
              <Text style={{ fontFamily: "semi", color: "#fff", fontSize: 11 }}>
                Coming soon
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeTagModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backdropTouchable}
              onPress={closeTagModal}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTagModal}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Your Nippyy Tag</Text>
              <Text style={styles.modalSubtitle}>
                Share this tag with friends.
              </Text>

              {/* Tag Display */}
              <View style={styles.tagContainer}>
                <View style={styles.tagIconWrapper}>
                  <AtSign size={24} color="#0B0D47" strokeWidth={2} />
                </View>
                <Text style={styles.tagText}>{userTag}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={copyToClipboard}
                >
                  <Copy size={20} color="#0B0D47" strokeWidth={2} />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={shareTag}
                >
                  <Share size={20} color="#fff" strokeWidth={2} />
                  <Text
                    style={[styles.actionButtonText, styles.shareButtonText]}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>
                Anyone with your tag can send you money on Nippyy
              </Text>
            </View>
          </Animated.View>
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
  optionWrapper: {
    backgroundColor: "#eee",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  innerLeftIconWrapper: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#C4C4D0",
  },
  topText: {
    fontFamily: "semi",
    fontSize: 15,
  },
  lowerText: {
    fontFamily: "regular",
    fontSize: 13,
    color: "grey",
  },
  comingSoonPill: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "green",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    marginTop: -20,
    paddingVertical: 5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 4,
  },
  modalContent: {
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#0B0D47",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: "regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  tagContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  tagIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tagText: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#0B0D47",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  shareButton: {
    backgroundColor: "#0B0D47",
    borderColor: "#0B0D47",
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: "semi",
    color: "#0B0D47",
    marginLeft: 8,
  },
  shareButtonText: {
    color: "#fff",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
