import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { CircleFadingArrowUp } from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  const { theme } = useTheme();
  return (
    <View style={styles.wrapper}>
      {transactions?.length <= 0 ? (
        <View>
          <View style={styles.emptyTransactionWrapper}>
            <CircleFadingArrowUp color={theme.colors.primary} size={30} />
          </View>
          <Text style={{marginTop:2,fontFamily:'semi',fontSize:12}}>Nothing yet</Text>
        </View>
      ) : (
        <View>
          <Text>Display something here....</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
  },
  emptyTransactionWrapper: {
    height: 60,
    width: 60,
    backgroundColor: "#eee",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
