import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  View,
  Button,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// import { Pipeline } from "react-native-transformers";
import * as ort from "onnxruntime-react-native";
import { Asset } from "expo-asset";
import { env, AutoTokenizer, PreTrainedTokenizer } from "@xenova/transformers";

export default function HomeScreen() {
  console.log("At home");

  let myModel: ort.InferenceSession;

  async function loadMNISTModel() {
    try {
      console.log("start");
      const assets = await Asset.loadAsync(require("@/assets/mnist.onnx"));
      const modelUri = assets[0].localUri;
      console.log("modelUri ", modelUri);
      console.log("end");
      if (!modelUri) {
        Alert.alert("failed to get model URI", `${assets[0]}`);
      } else {
        // load model from model url path
        myModel = await ort.InferenceSession.create(modelUri);
        Alert.alert(
          "model loaded successfully",
          `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`
        );
      }
    } catch (e) {
      Alert.alert("failed to load model", `${e}`);
      throw e;
    }
  }

  async function runModel() {
    try {
      // Prepare model input data
      // Note: In real use case, you must set the inputData to the actual input values
      const inputData = new Float32Array(28 * 28);
      const feeds: Record<string, ort.Tensor> = {};
      feeds[myModel.inputNames[0]] = new ort.Tensor(inputData, [1, 1, 28, 28]);
      // Run inference session
      const fetches = await myModel.run(feeds);
      // Process output
      const output = fetches[myModel.outputNames[0]];
      if (!output) {
        Alert.alert("failed to get output", `${myModel.outputNames[0]}`);
      } else {
        Alert.alert(
          "model inference successfully",
          `output shape: ${output.dims}, output data: ${output.data}`
        );
      }
    } catch (e) {
      Alert.alert("failed to inference model", `${e}`);
      throw e;
    }
  }

  // const loadPipelineModel = async () => {
  //   console.log("start");
  //   await Pipeline.TextGeneration.init(
  //     "Felladrin/onnx-Llama-160M-Chat-v1",
  //     "onnx/decoder_model_merged.onnx"
  //   );
  //   console.log("end");
  // };

  const loadTransformerPipelineModel = async () => {
    try {

    } catch (e) {
      Alert.alert("failed to inference model in loadTransformerPipelineModel", `${e}`);
      throw e;
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>

        <HelloWave />
      </ThemedView>
      <Button
        title="Ping"
        onPress={() => {
          console.log("Ping");
        }}
      />
      <Button title="loadMNISTModel" onPress={loadMNISTModel} />
      <Button title="Run Model" onPress={runModel} />
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
