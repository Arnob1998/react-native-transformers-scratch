import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  View,
  Button,
  TextInput,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as FileSystem from "expo-file-system";
import { Pipeline } from "@/extensions/transformer-pipeline";
import { downloadFilesFromCollection } from "@/extensions/downloader";
import { ModelCollections } from "@/constants/ModelCollections";
import { SendHorizontal, Plus } from "lucide-react-native";

export default function HomeScreen() {
  // console.log("At home");
  const [progress, setProgress] = useState<number>();
  const [input, setInput] = useState<string>("Hi");
  const [output, setOutput] = useState<string>();
  const [textInput, onChangeTextInput] = useState<string>("");

  const CustomTransformerPipeline = async () => {
    await downloadFilesFromCollection(
      ModelCollections["Llama-160M-Chat-v1"],
      "Llama-160M-Chat-v1"
    );
    console.log("start");
    await Pipeline.TextGeneration.init(
      "Llama-160M-Chat-v1",
      "decoder_model_merged.onnx",
      {
        verbose: true,
        max_tokens: 100,
      }
    );
    console.log("AutoComplete start");
    console.log("input : ", input);
    await Pipeline.TextGeneration.generate(input, setOutput);
    console.log("AutoComplete end");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "space-between", //Centered vertically
          alignItems: "center", // Centered horizontally
          flexDirection: "row",
        }}
      >
        <ThemedText>History</ThemedText>
        <ThemedText>Model</ThemedText>
        <ThemedText>Setting</ThemedText>
      </View>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }}
      >
        {output ? (
          <ThemedText>{output}</ThemedText>
        ) : (
          <ThemedText>NA</ThemedText>
        )}
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
          justifyContent: "space-between", //Centered vertically
          alignItems: "center", // Centered horizontally
          flexDirection: "row",
        }}
      >
        <View style={{ padding: 5 }}>
          <Plus color={"white"} />
        </View>
        <TextInput
          onChangeText={onChangeTextInput}
          value={textInput}
          style={{
            height: 45,
            backgroundColor: "#242424",
            borderRadius: 30,
            paddingHorizontal: 10,
            color: "white",
            width: "80%",
          }}
          placeholder="    Type a message..."
          placeholderTextColor="white"
          onSubmitEditing={() => {
            setInput(textInput);
            onChangeTextInput("");
            CustomTransformerPipeline();
            setInput("");
          }}
          returnKeyType="done"
        />
        <View style={{ padding: 5 }}>
          <SendHorizontal color={"white"} />
        </View>
      </View>
    </SafeAreaView>
  );
}
