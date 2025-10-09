import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  Landmark,
  CheckCircle,
  Delete,
  X,
  Tag,
} from "lucide-react-native";
import {
  fetchBanks,
  resolveAccount,
} from "../../../api/fetch-verify-bank-account";

const { width, height } = Dimensions.get('window');

const dummyBanks = [
  { name: "Access Bank", code: "044" },
  { name: "GTBank", code: "058" },
  { name: "UBA", code: "033" },
  { name: "Zenith Bank", code: "057" },
  { name: "Sterling Bank", code: "232" },
];

const transactionCategories = [
  { id: 1, name: "Food", icon: "🍽️" },
  { id: 2, name: "Transportation", icon: "🚗" },
  { id: 3, name: "Groceries", icon: "🛒" },
  { id: 4, name: "Utilities", icon: "💡" },
  { id: 5, name: "Housing", icon: "🏠" },
  { id: 6, name: "Lifestyle", icon: "✨" },
  { id: 7, name: "Entertainment", icon: "🎬" },
  { id: 8, name: "Healthcare", icon: "🏥" },
  { id: 9, name: "Savings", icon: "💰" },
  { id: 10, name: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: 11, name: "Debt Repayment", icon: "💳" },
  { id: 12, name: "Gifts", icon: "🎁" },
  { id: 13, name: "Relationships", icon: "❤️" },
  { id: 14, name: "Education", icon: "📚" },
  { id: 15, name: "Investments", icon: "📈" },
  { id: 16, name: "Miscellaneous", icon: "📋" },
];

export default function Bank() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [pinError, setPinError] = useState("");
  const [isValidatingPin, setIsValidatingPin] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Refs for inputs
  const accountNumberRef = useRef(null);
  const amountRef = useRef(null);
  const narrationRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Animation refs for bottom sheet
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const categorySlideAnim = useRef(new Animated.Value(height)).current;
  const categoryFadeAnim = useRef(new Animated.Value(0)).current;

  // PIN pad numbers
  const pinNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete']
  ];

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Bottom sheet animation functions
  const showBottomSheet = () => {
    setPinModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideBottomSheet = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setPinModalVisible(false);
      setPin("");
    });
  };

  // Category modal animation functions
  const showCategoryModal = () => {
    setCategoryModalVisible(true);
    Animated.parallel([
      Animated.timing(categoryFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(categorySlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideCategoryModal = () => {
    Animated.parallel([
      Animated.timing(categoryFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(categorySlideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setCategoryModalVisible(false);
    });
  };

  //search filter 
  useEffect(() => {
    setFilteredBanks(
      banks?.filter((bank) =>
        bank?.name?.toLowerCase()?.includes(search?.toLowerCase())
      )
    );
  }, [search]);

  //fetch all banks
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const allBanks = await fetchBanks();
        setBanks(allBanks);
        setFilteredBanks(allBanks);
      } catch (error) {
        console.log("Failed to load banks", error);
      }
    };
    loadBanks();
  }, []);

  //verify the account number
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      verifyAccount(accountNumber, selectedBank.code);
    } else {
      setAccountName(""); 
    }
  }, [accountNumber, selectedBank]);

  //verification account function
  const verifyAccount = async (acctNumber, bankCode) => {
    try {
      setVerifying(true);
      const result = await resolveAccount(acctNumber, bankCode);
      setAccountName(result?.account_name);
    } catch (error) {
      console.log("Verification failed", error);
      setAccountName("");
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setModalVisible(false);
    // Focus on account number input after bank selection
    setTimeout(() => {
      accountNumberRef.current?.focus();
    }, 100);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    hideCategoryModal();
  };

  const handlePinPress = (value) => {
    if (value === 'delete') {
      setPin(prev => prev.slice(0, -1));
    } else if (value !== '' && pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);
      
      // Auto-validate when 4 digits are entered
      if (newPin.length === 4) {
        setTimeout(() => {
          validatePin(newPin);
        }, 200); // Small delay for better UX
      }
    }
  };

  const validatePin = async (enteredPin) => {
    try {
      setIsValidatingPin(true);
      setPinError("");
      
      // Dummy validation - replace with your actual PIN validation logic
      const isValidPin = await validateUserPin(enteredPin);
      
      if (isValidPin) {
        // PIN is correct, process payment and navigate to success screen
        await processPayment();
        hideBottomSheet();
        navigation.navigate('Success', {
          amount: amount,
          accountName: accountName,
          bankName: selectedBank?.name,
          accountNumber: accountNumber,
          narration: narration || null,
          category: selectedCategory?.name || null,
          transactionId: generateTransactionId(),
        });
      } else {
        // PIN is incorrect, show error
        setPinError("Invalid PIN. Please try again.");
        setPin("");
      }
    } catch (error) {
      console.log("PIN validation error:", error);
      setPinError("Something went wrong. Please try again.");
      setPin("");
    } finally {
      setIsValidatingPin(false);
    }
  };

  // Dummy function for PIN validation - replace with your actual logic
  const validateUserPin = async (pin) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy validation: return true if PIN is "1234", false otherwise
    // Replace this with your actual PIN validation logic
    return pin === "1234";
  };

  // Dummy function for payment processing - replace with your actual logic
  const processPayment = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Payment processed successfully");
  };

  // Generate dummy transaction ID - replace with your actual logic
  const generateTransactionId = () => {
    return 'TXN' + Date.now().toString().slice(-8);
  };

  const formatAmount = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const isFormValid = accountName && amount && narration.trim() && selectedCategory;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Scroll to bottom when form becomes valid or when needed
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.primary }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Transfer</Text>
        <View />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.balanceWrapper}>
          <Text style={styles.balanceText}>
            Balance : <Text>967,99,00</Text>
          </Text>
        </View>

        {/* Bank Select */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.bankInput}
        >
          <TouchableOpacity style={styles.bankIconWrapper}>
            <Landmark size={18} color={"#0B0D47"} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.bankInputText}>
            {selectedBank ? selectedBank.name : "Select Bank"}
          </Text>
          <ChevronDown size={18} color="#444" strokeWidth={3} />
        </TouchableOpacity>

        {/* Account Number */}
        <TextInput
          ref={accountNumberRef}
          style={styles.accountInput}
          placeholder="Enter Account Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={accountNumber}
          maxLength={11}
          onChangeText={setAccountNumber}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (accountName) {
              amountRef.current?.focus();
            }
          }}
        />

        {verifying ? (
          <Text style={{ fontFamily: "regular", marginTop: 10, color: "#666" }}>
            Verifying account...
          </Text>
        ) : accountName ? (
          <View style={styles.accountInfoBox}>
            <CheckCircle color="#0BAA56" size={20} strokeWidth={2.5} />
            <Text style={styles.accountInfoText}>{accountName}</Text>
          </View>
        ) : null}

        {/* Amount and Narration Fields - Show only after account verification */}
        {accountName && (
          <>
            {/* Amount Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                  ref={amountRef}
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => setAmount(formatAmount(text))}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    narrationRef.current?.focus();
                  }}
                  onFocus={() => {
                    if (Platform.OS === 'ios') {
                      setTimeout(() => scrollToBottom(), 300);
                    }
                  }}
                />
              </View>
            </View>

            {/* Narration Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Narration</Text>
              <TextInput
                ref={narrationRef}
                style={styles.narrationInput}
                placeholder="Enter transaction description"
                placeholderTextColor="#999"
                value={narration}
                onChangeText={setNarration}
                maxLength={100}
                returnKeyType="done"
                onSubmitEditing={dismissKeyboard}
                onFocus={() => {
                  if (Platform.OS === 'ios') {
                    setTimeout(() => scrollToBottom(), 300);
                  }
                }}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity
                onPress={showCategoryModal}
                style={styles.categoryInput}
              >
                <View style={styles.categoryIconWrapper}>
                  <Tag size={18} color={"#0B0D47"} strokeWidth={2.5} />
                </View>
                <View style={styles.categoryTextContainer}>
                  {selectedCategory ? (
                    <>
                      <Text style={styles.categoryEmoji}>{selectedCategory.icon}</Text>
                      <Text style={styles.categoryInputText}>{selectedCategory.name}</Text>
                    </>
                  ) : (
                    <Text style={styles.categoryInputText}>Select Category</Text>
                  )}
                </View>
                <ChevronDown size={18} color="#444" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Pay Button - Always visible when form is valid */}
        {accountName && (
          <View style={styles.payButtonContainer}>
            <TouchableOpacity 
              style={[styles.payBtn, !isFormValid && styles.payBtnDisabled]}
              onPress={() => {
                dismissKeyboard();
                if (isFormValid) {
                  showBottomSheet();
                }
              }}
              disabled={!isFormValid}
            >
              <Text style={[styles.payBtnText, !isFormValid && styles.payBtnTextDisabled]}>
                Pay ₦{amount || '0.00'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bank Selection Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <Search size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search bank"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>

          {/* Bank List */}
          <FlatList
            data={filteredBanks}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleSelectBank(item);
                  setSearch("");
                }}
                style={styles.bankItem}
              >
                <Text style={styles.bankName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </KeyboardAvoidingView>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideCategoryModal}
      >
        <Animated.View style={[styles.bottomSheetOverlay, { opacity: categoryFadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={hideCategoryModal}
          />
          
          <Animated.View 
            style={[
              styles.categoryModalContainer,
              { transform: [{ translateY: categorySlideAnim }] }
            ]}
          >
            {/* Bottom Sheet Handle */}
            <View style={styles.bottomSheetHandle} />
            
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Category</Text>
              <TouchableOpacity 
                onPress={hideCategoryModal}
                style={styles.closeButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Categories Grid */}
            <ScrollView 
              style={styles.categoriesScrollView}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.categoriesGrid}>
                {transactionCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory?.id === category.id && styles.categoryItemSelected
                    ]}
                    onPress={() => handleSelectCategory(category)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryName,
                      selectedCategory?.id === category.id && styles.categoryNameSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* PIN Entry Bottom Sheet */}
      <Modal
        visible={pinModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideBottomSheet}
      >
        <Animated.View style={[styles.bottomSheetOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={hideBottomSheet}
          />
          
          <Animated.View 
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Bottom Sheet Handle */}
            <View style={styles.bottomSheetHandle} />
            
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Enter PIN</Text>
              <TouchableOpacity 
                onPress={hideBottomSheet}
                style={styles.closeButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Transaction Summary */}
            <View style={styles.transactionSummary}>
              <Text style={styles.summaryText}>Transfer ₦{amount}</Text>
              <Text style={styles.summarySubText}>to {accountName}</Text>
              <Text style={styles.summaryBank}>{selectedBank?.name}</Text>
              {selectedCategory && (
                <View style={styles.summaryCategory}>
                  <Text style={styles.summaryCategoryText}>
                    {selectedCategory.icon} {selectedCategory.name}
                  </Text>
                </View>
              )}
            </View>

            {/* PIN Display */}
            <View style={styles.pinDisplay}>
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    pin.length > index && styles.pinDotFilled,
                    pinError && styles.pinDotError
                  ]}
                />
              ))}
            </View>

            {/* PIN Error Message */}
            {pinError ? (
              <Text style={styles.pinErrorText}>{pinError}</Text>
            ) : null}

            {/* Validating PIN Indicator */}
            {isValidatingPin && (
              <Text style={styles.validatingText}>Validating PIN...</Text>
            )}

            {/* PIN Keypad */}
            <View style={styles.pinKeypad}>
              {pinNumbers.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.pinRow}>
                  {row.map((number, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.pinButton,
                        number === '' && styles.pinButtonEmpty,
                        isValidatingPin && styles.pinButtonDisabled
                      ]}
                      onPress={() => handlePinPress(number)}
                      disabled={number === '' || isValidatingPin}
                    >
                      {number === 'delete' ? (
                        <Delete size={20} color={isValidatingPin ? "#ccc" : "#666"} />
                      ) : (
                        <Text style={[
                          styles.pinButtonText,
                          isValidatingPin && styles.pinButtonTextDisabled
                        ]}>
                          {number}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  balanceWrapper: {
    marginTop: 15,
  },
  balanceText: {
    fontFamily: "medium",
    fontSize: 16,
  },
  bankInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  bankIconWrapper: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#C4C4D0",
  },
  bankInputText: {
    fontFamily: "regular",
    fontSize: 15,
    color: "#444",
    flex: 1,
    marginLeft: 10,
  },
  accountInput: {
    fontFamily: "regular",
    fontSize: 15,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 17,
    marginTop: 20,
  },
  accountInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
  },
  accountInfoText: {
    fontFamily: "medium",
    fontSize: 15,
    color: "#0B0D47",
  },
  inputWrapper: {
    marginTop: 20,
  },
  inputLabel: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 17,
  },
  currencySymbol: {
    fontFamily: "medium",
    fontSize: 18,
    color: "#666",
    marginRight: 10,
  },
  amountInput: {
    fontFamily: "regular",
    fontSize: 18,
    flex: 1,
    color: "#333",
  },
  narrationInput: {
    fontFamily: "regular",
    fontSize: 15,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 17,
    minHeight: 60,
    textAlignVertical: "top",
  },
  categoryInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
  },
  categoryIconWrapper: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#C4C4D0",
  },
  categoryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryInputText: {
    fontFamily: "regular",
    fontSize: 15,
    color: "#444",
  },
  payBtn: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "#0B0D47",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payBtnDisabled: {
    backgroundColor: "#ccc",
  },
  payBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "semi",
  },
  payBtnTextDisabled: {
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "bold",
    fontSize: 18,
  },
  modalCancel: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#888",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  searchInput: {
    fontFamily: "regular",
    fontSize: 15,
    flex: 1,
    paddingVertical: 10,
  },
  bankItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  bankName: {
    fontFamily: "medium",
    fontSize: 16,
  },
  // Category Modal Styles
  categoryModalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    height:500
  },
  categoriesScrollView: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  categoryItem: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryItemSelected: {
    backgroundColor: "#E8F3FF",
    borderColor: "#0B0D47",
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: "medium",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  categoryNameSelected: {
    color: "#0B0D47",
  },
  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.8,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: "#0B0D47",
  },
  closeButton: {
    padding: 4,
  },
  transactionSummary: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
  },
  summaryText: {
    fontSize: 24,
    fontFamily: "bold",
    color: "#0B0D47",
    marginBottom: 8,
  },
  summarySubText: {
    fontSize: 16,
    fontFamily: "medium",
    color: "#666",
    marginBottom: 4,
  },
  summaryBank: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#888",
    marginBottom: 8,
  },
  summaryCategory: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E8F3FF",
    borderRadius: 20,
    marginTop: 8,
  },
  summaryCategoryText: {
    fontSize: 12,
    fontFamily: "medium",
    color: "#0B0D47",
  },
  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  pinDotFilled: {
    backgroundColor: "#0B0D47",
    borderColor: "#0B0D47",
  },
  pinDotError: {
    backgroundColor: "#FF4444",
    borderColor: "#FF4444",
  },
  pinErrorText: {
    color: "#FF4444",
    fontSize: 14,
    fontFamily: "medium",
    textAlign: "center",
    marginBottom: 10,
  },
  validatingText: {
    color: "#0B0D47",
    fontSize: 14,
    fontFamily: "medium",
    textAlign: "center",
    marginBottom: 10,
  },
  pinKeypad: {
    alignItems: "center",
  },
  pinRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  pinButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pinButtonEmpty: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  pinButtonDisabled: {
    backgroundColor: "#F0F0F0",
    borderColor: "#E0E0E0",
  },
  pinButtonText: {
    fontSize: 24,
    fontFamily: "bold",
    color: "#0B0D47",
  },
  pinButtonTextDisabled: {
    color: "#ccc",
  },
});
