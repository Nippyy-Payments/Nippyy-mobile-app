import React, { createContext, useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const KycModalContext = createContext();

export function KycModalProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const navigation = useNavigation();

  const openKycModal = (msg) => {
    setMessage("You need to complete the KYC process to activate account.");
    setVisible(true);
  };

  const closeKycModal = () => setVisible(false);

  return (
    <KycModalContext.Provider value={{ openKycModal, closeKycModal }}>
      {children}

      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={closeKycModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View>
              <Image
                style={styles.kycImage}
                source={require('../../assets/images/kyc.png')} />
            </View>
            <Text style={styles.title}>KYC Required</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                closeKycModal();
                navigation.navigate("KycSteps");
              }}
            >
              <Text style={styles.buttonText}>Complete now</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeKycModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KycModalContext.Provider>
  );
}

export const useKycModal = () => useContext(KycModalContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  kycImage: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius:10
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 10,
    alignSelf: 'center'
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    fontFamily: 'regular',
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 20
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "bold",
    fontSize: 16,
  },
  cancelText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    fontFamily: "medium",
  },
});
