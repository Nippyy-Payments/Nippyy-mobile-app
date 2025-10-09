import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ChevronDown } from "lucide-react-native";

const { height } = Dimensions.get("window");

const currencies = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    flag: "https://cdn3.iconfinder.com/data/icons/major-world-flags-1/512/nigeria_nigerian_national_country_flag-1024.png",
  },
  {
    code: "USD",
    name: "US Dollar",
    flag: "https://cdn1.iconfinder.com/data/icons/flags-of-the-world-2/128/united-states-circle-1024.png",
  },
  {
    code: "EUR",
    name: "Euro",
    flag: "https://cdn4.iconfinder.com/data/icons/world-flags-circular/1000/Flag_of_Europe_-_Circle-1024.png",
  },
  {
    code: "GBP",
    name: "British Pound",
    flag: "https://cdn1.iconfinder.com/data/icons/flags-of-the-world-2/128/england-circle-1024.png",
  },
];

export default function Convert() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState("from");

  const userBalance = 567000; // Example balance

  const handleCurrencySelect = (currency) => {
    if (selectingFor === "from") {
      setFromCurrency(currency);
    } else {
      setToCurrency(currency);
    }
    setModalVisible(false);
  };

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = fromAmount;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handlePercentageSelect = (percentage) => {
    const amount = ((userBalance * percentage) / 100).toString();
    setFromAmount(amount);
    // You can add conversion logic here
  };

  const handleConvert = () => {
    // Add your conversion logic here
    console.log(
      "Converting...",
      fromAmount,
      fromCurrency.code,
      "to",
      toCurrency.code
    );
  };

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => handleCurrencySelect(item)}
    >
      <Image source={{ uri: item.flag }} style={styles.flagImage} />
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyCode}>{item.code}</Text>
        <Text style={styles.currencyName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Currency Conversion</Text>
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
        <View>
          <Text style={styles.userBalance}>
            Balance: ₦ {userBalance.toLocaleString()}
          </Text>
        </View>

        <View style={styles.conversionContainer}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => {
                setSelectingFor("from");
                setModalVisible(true);
              }}
            >
              <Image
                source={{ uri: fromCurrency.flag }}
                style={styles.flagImageSmall}
              />
              <Text style={styles.currencyText}>{fromCurrency.code}</Text>
              <ChevronDown color="#666" size={16} />
            </TouchableOpacity>
            <TextInput
              style={styles.amountInput}
              value={fromAmount}
              onChangeText={setFromAmount}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Image
              style={styles.swapIcon}
              resizeMode="contain"
              source={require("../../../../assets/icons/nippyy-send.png")}
            />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => {
                setSelectingFor("to");
                setModalVisible(true);
              }}
            >
              <Image
                source={{ uri: toCurrency.flag }}
                style={styles.flagImageSmall}
              />
              <Text style={styles.currencyText}>{toCurrency.code}</Text>
              <ChevronDown color="#666" size={16} />
            </TouchableOpacity>
            <TextInput
            editable={false}
              style={styles.amountInput}
              value={toAmount}
              onChangeText={setToAmount}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.rateInfo}>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Exchange Rate:{" "}₦1,500/$1</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Our Fee:{" "}$0.5</Text>
            </View>
          </View>

          {/* Percentage Buttons */}
          <View style={styles.percentageContainer}>
            <TouchableOpacity
              style={[styles.percentageButton]}
              onPress={() => handlePercentageSelect(100)}
            >
              <Text style={styles.percentageText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.percentageButton}
              onPress={() => handlePercentageSelect(25)}
            >
              <Text style={styles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.percentageButton}
              onPress={() => handlePercentageSelect(50)}
            >
              <Text style={styles.percentageText}>50%</Text>
            </TouchableOpacity>
          </View>

          {/* Convert Button */}
          <TouchableOpacity
            style={[
              styles.convertButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleConvert}
          >
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={currencies}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
    paddingBottom: 30,
  },
  conversionContainer: {
    marginTop: 20,
  },
  userBalance: {
    fontFamily: "semi",
    fontSize: 16,
    marginTop: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#e9ecef",
  },
  flagImageSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
    fontFamily: "bold",
  },
  swapIcon: {
    transform: [{ rotate: "90deg" }],
    height: 20,
    width: 20,
    marginBottom: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    textAlign: "left",
    fontFamily: "medium",
  },
  percentageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  percentageButton: {
    flex: 1,
    backgroundColor: null,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1.2,
    marginTop: 15,
  },
  percentageText: {
    fontSize: 14,
    color: "#495057",
    fontFamily: "semi",
  },
  swapButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  rateInfo: {
    marginTop: 0,
    paddingTop: 16,
    alignSelf: "flex-end",
  },
  rateRow: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  rateLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily:"medium"
  },
  rateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  convertButton: {
    backgroundColor: "#007bff",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  convertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: "bold",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    width: 30,
    textAlign: "center",
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  flagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    color: "#333",
    fontFamily: "bold",
  },
  currencyName: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "medium",
  },
});
