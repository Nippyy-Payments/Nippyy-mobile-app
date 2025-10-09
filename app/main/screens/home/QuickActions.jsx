import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Wifi, Phone, Flashlight, Tv2 } from "lucide-react-native";

export default function QuickActions() {
  //quick action items
  const quickActions = [
    {
      icon: <Wifi size={20} color="#0B0D47" />,
      label: "Data",
      bg: "#F0F3FF",
    },
    {
      icon: <Phone size={20} color="#0B0D47" />,
      label: "Airtime",
      bg: "#FFF5EC",
    },
    {
      icon: <Flashlight size={20} color="#0B0D47" />,
      label: "Electric.",
      bg: "#FFF0F0",
    },
    {
      icon: <Tv2 size={20} color="#0B0D47" />,
      label: "TV/Cable",
      bg: "#E9FFF6",
    },
  ];

  return (
    <View>
      <View style={styles.quickActionsWrapper}>
        <View>
          <Text style={styles.titleStyle}>Quick actions</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllStyle}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: action.bg }]}
          >
            <View style={styles.iconWrapper}>{action.icon}</View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsWrapper: {
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
  container: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: 70,
    height: 85,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrapper: {
    backgroundColor: "#E9EAF5",
    padding: 10,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontFamily: "medium",
    color: "#0A0538",
  },
});
