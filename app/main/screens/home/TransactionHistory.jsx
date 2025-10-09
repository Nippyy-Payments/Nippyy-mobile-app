import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

export default function TransactionHistory() {

    const [data,setData]=useState([]);
    const [loading,setLoading]=useState(true);


  return (
    <View style={{marginTop:45}}>
      <View style={styles.transcationWrapper}>
        <View>
          <Text style={styles.titleStyle}>Transactions</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllStyle}>See all</Text>
        </TouchableOpacity>
      </View>


      <View>
        {data?.length<=0?(
            <View style={styles.noRecentTransactionWrapper}>
                <Text style={styles.noRecentTransactionText}>No Recent Transactions.</Text>
            </View>
        ):(
            <View>
            </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transcationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7.5,
  },
  titleStyle: {
    fontFamily: "bold",
    fontSize: 16,
  },
  seeAllStyle: {
    fontFamily: "semi",
    color: "grey",
    fontSize:13
  },
  noRecentTransactionWrapper:{
    alignSelf:"center",
    marginTop:35
  },
  noRecentTransactionText:{
    fontFamily:'bold',
    color:'grey',
    fontSize:14
  }
});

