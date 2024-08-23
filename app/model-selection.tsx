import { View, Platform, Switch, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ModelCollections } from "@/constants/ModelCollections";
import { useState, useEffect } from "react";
import { useModelStore } from "@/store/models";
import * as FileSystem from "expo-file-system";

export default function Modal() {
  const isPresented = router.canGoBack();
  const selected_model = useModelStore((state) => state.model);
  const setModel = useModelStore((state) => state.setModel);


  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <ThemedText>Model Selected : {selected_model}</ThemedText>
      {Object.keys(ModelCollections).map((item, i) => (
        <TouchableOpacity key={i} style={{ marginVertical: 10 }} onPress={()=>{setModel(item)}}>
          <ThemedText>{item}</ThemedText>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}
