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
import { SendHorizontal, Plus, Square, Settings, MessageSquare, ChevronDown} from "lucide-react-native";
import { useModelStore } from "@/store/models";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [output, setOutput] = useState<string>();
  const [textInput, onChangeTextInput] = useState<string>("");
  const selected_model = useModelStore((state) => state.model);
  const [model_active, setModelActive] = useState(false);
  
  useEffect(()=>{
    console.log("Selected model : ", selected_model)
  },[])

  const CustomTransformerPipeline = async (prompt) => {
    await downloadFilesFromCollection(
      ModelCollections[selected_model],
      selected_model
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
    console.log("input : ", prompt);
    setModelActive(true);
    await Pipeline.TextGeneration.generate(prompt, setOutput);
    setModelActive(false);
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
          paddingHorizontal:15
        }}
      >
        <MessageSquare color={"white"} size={27}/>
        <TouchableOpacity style={{ backgroundColor:"#2f2f2f",      	borderRadius: 10,
        borderWidth: 1, }}>
        <ThemedText style={{fontSize:14 ,fontWeight:"600", paddingHorizontal:13, paddingVertical:5,}}><Link href={"/model-selection"}>{selected_model} <ChevronDown color={"white"} size={16}/></Link></ThemedText>
        </TouchableOpacity>
        
        <Settings color={"white"}size={27} />
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
            console.log("Keyboard Entered : ", textInput)
            CustomTransformerPipeline(textInput);
            onChangeTextInput("")
          }}
          returnKeyType="done"
        />
        <View style={{ padding: 5 }}>
          {!model_active ? <SendHorizontal color={"white"} onPress={()=>{Pipeline.TextGeneration.release();}} /> : <Square color={"white"} onPress={()=>{Pipeline.TextGeneration.release(); setModelActive(false);}} /> }
        </View>
      </View>
    </SafeAreaView>
  );
}
