import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import Celebrate from "../../components/animations/Celebrate";
import { Download, Eye } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Success({ route }) {
  const navigation = useNavigation();
  const { accountName, amount } = route.params;
  const { theme } = useTheme();

  return (
    <View style={[styles.container]}>
      <View style={styles.wrapper}>
        <Text style={styles.header}>Funds Transfer</Text>

        <Celebrate />

        <Text style={styles.title}>Success!</Text>
        <Text style={styles.message}>
          You've successfully sent{" "}
          <Text style={styles.amount}>{amount}</Text> to{" "}
          <Text style={styles.recipient}>{accountName}</Text>
        </Text>

        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: theme.colors.skyblue }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Reciept")}>
            <Eye size={16} color="#fff" />
            <Text style={styles.secondaryText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Download size={16} color="#fff" />
            <Text style={styles.secondaryText}>Save Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D47",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  wrapper: {
    alignItems: "center",
    marginTop: 85,
    width: "100%",
  },
  header: {
    fontFamily: "bold",
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    marginTop: -10,
    color: "#fff",
    fontFamily: "bold",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#e0e0e0",
    fontFamily: "semi",
    lineHeight: 22,
  },
  amount: {
    fontWeight: "600",
    color: "#fff",
  },
  recipient: {
    fontWeight: "600",
    color: "#fff",
  },
  doneButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: width - 50,
    marginTop: 25,
  },
  doneText: {
    fontFamily: "semi",
    color: "#fff",
    fontSize: 16,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    gap: 6,
    borderWidth: 1,
    borderColor: "#ffffff33", 
    borderRadius: 8,
    backgroundColor: "#ffffff10", 
    height:45,
    flex:1
  },
  secondaryText: {
    color: "#fff",
    fontFamily: "medium",
    fontSize: 14,
  },
});
