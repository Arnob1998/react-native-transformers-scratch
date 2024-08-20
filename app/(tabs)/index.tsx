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
import { Asset, useAssets } from "expo-asset";
import { tokenizer } from '@/constants/tokenizer';
import * as FileSystem from 'expo-file-system';
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

  async function runMNISTModel() {
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

  async function loadDistilModel() {
    try {
      console.log("start");
      const assets = await Asset.loadAsync(require("@/assets/distilbert-base-uncased-finetuned-sst-2-english/model_quantized.onnx"));
      const modelUri = assets[0].localUri;
      console.log("modelUri ", modelUri);
      console.log("end");
      if (!modelUri) {
        console.log("failed to get model URI", `${assets[0]}`);
      } else {
        // load model from model url path
        myModel = await ort.InferenceSession.create(modelUri);
        console.log(
          "model loaded successfully",
          `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`
        );

        return modelUri
      }
    } catch (e) {
      Alert.alert("failed to load model", `${e}`);
      throw e;
    }
  }

  async function loadDistilTokenizer() {
    try {
      console.log("start");
      return tokenizer
    } catch (e) {
      Alert.alert("failed to load model", `${e}`);
      console.log(e)
      throw e;
    }
  }


  const loadDistilPipelineModel = async () => {
    try {
      // const session = await loadDistilModel();
      const test = tokenize()
      console.log(test)

    } catch (e) {
      Alert.alert("failed to inference model in loadDistilPipelineModel", `${e}`);
      console.log(e)
      throw e;
    }
  };

  async function runInference(session, inputIds) {
    const feeds = { input_ids: inputIds };
    const output = await session.run(feeds);
    console.log(output);
  }
  
  async function processText(session, text, tokenizerConfig) {
    const inputIds = tokenize(text, tokenizerConfig);
    await runInference(session, inputIds);
  }

  function tokenize(text) {
    // Example: Simple tokenization process
    const tokens = text.toLowerCase().split(' ').map(word => tokenizer[word] || tokenizer['[UNK]']);
    const inputIds = [101, ...tokens, 102]; // Add [CLS] and [SEP] tokens
    return new Int32Array(inputIds);
  }
  


  // const loadPipelineModel = async () => {
  //   console.log("start");
  //   await Pipeline.TextGeneration.init(
  //     "Felladrin/onnx-Llama-160M-Chat-v1",
  //     "onnx/decoder_model_merged.onnx"
  //   );
  //   console.log("end");
  // };

  async function checkFilePaths() {
    const basePath = FileSystem.bundleDirectory + 'models/distilbert-base-uncased-finetuned-sst-2-english/';
  
    const tokenizerJsonUri = basePath + 'tokenizer.json';
    const tokenizerConfigUri = basePath + 'tokenizer_config.json';
    const vocabTxtUri = basePath + 'vocab.txt';
  
    // Log the paths
    console.log("Tokenizer JSON URI:", tokenizerJsonUri);
    console.log("Tokenizer Config URI:", tokenizerConfigUri);
    console.log("Vocab Txt URI:", vocabTxtUri);
  
    // Check if the files exist
    const tokenizerJsonExists = await FileSystem.getInfoAsync(tokenizerJsonUri);
    const tokenizerConfigExists = await FileSystem.getInfoAsync(tokenizerConfigUri);
    const vocabTxtExists = await FileSystem.getInfoAsync(vocabTxtUri);
  
    console.log("Tokenizer JSON exists:", tokenizerJsonExists);
    console.log("Tokenizer Config exists:", tokenizerConfigExists);
    console.log("Vocab Txt exists:", vocabTxtExists);
    
  }

  // const downloadAndSaveFile = async (url, filename) => {
  //   try {
  //     // Define the path where you want to save the file
  //     const fileUri = FileSystem.documentDirectory + filename;
      
  //     // Download the file
  //     const response = await FileSystem.downloadAsync(url, fileUri);
      
  //     console.log('File downloaded to:', response.uri);
  //     return response.uri; // Return the URI for further use
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     return null;
  //   }
  // };

  const saveFileToFolder = async (url, folderName, filename) => {
    try {
      // Define the directory path
      const directoryUri = FileSystem.documentDirectory + folderName;
      
      // Create the directory if it doesn't exist
      const { exists } = await FileSystem.getInfoAsync(directoryUri);
      if (!exists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
      }
      
      // Define the file path
      const fileUri = directoryUri + '/' + filename;
      
      // Download the file
      const response = await FileSystem.downloadAsync(url, fileUri);
      
      console.log('File downloaded to:', response.uri);
      return response.uri; // Return the URI for further use
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  const loadTransformerPipelineToken = async () => {
    try {
      // Download and store -- start
      const tokenizer_url = 'https://raw.githubusercontent.com/Arnob1998/react-native-transformers-scratch/main/assets/distilbert-base-uncased-finetuned-sst-2-english/tokenizer.json';
      const tokenizer_filename = 'tokenizer.json';
      const tokenizer_config_filename = 'tokenizer_config.json';
      const tokenizer_config_url = "https://raw.githubusercontent.com/Arnob1998/react-native-transformers-scratch/main/assets/distilbert-base-uncased-finetuned-sst-2-english/tokenizer_config.json"
      const folderName = 'distilbert-base-uncased-finetuned-sst-2-english'; // Example folder structure
      // const fileUri = await downloadAndSaveFile(url, filename);

      const tokenizerfileUri = await saveFileToFolder(tokenizer_url, folderName, tokenizer_filename);
      const tokenizer_configUri = await saveFileToFolder(tokenizer_config_url, folderName, tokenizer_config_filename);
  
      if (tokenizerfileUri && tokenizer_configUri) {
        // You can now use the fileUri to read or process the file later
        console.log('File is ready to use:', tokenizerfileUri, tokenizer_configUri);

        env.localModelPath = FileSystem.documentDirectory;
        env.allowRemoteModels = false; 
        const text = "Hello how are you"
        console.log("Local model path set to:", env.localModelPath);
        const tokenizer = await AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english");
        const tokens = tokenizer(text)
        console.log("tokens", tokens);

        console.log("loading model");
        const assets = await Asset.loadAsync(require("@/assets/distilbert-base-uncased-finetuned-sst-2-english/model_quantized.onnx"));
        const modelUri = assets[0].localUri;
        console.log("modelUri ", modelUri);
        if (!modelUri) {
          console.log("failed to get model URI", `${assets[0]}`);
        } 
          // load model from model url path
          myModel = await ort.InferenceSession.create(modelUri);
          console.log(
            "model loaded successfully",
            `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`)
        // Run inference
        const results = await myModel.run(tokens);
        console.log(results);
      }

      // Download and store -- end issue - [ReferenceError: Property 'TextDecoder' doesn't exist]
  
      // if (fileUri) {
      //   // You can now use the fileUri to read or process the file later
      //   console.log('File is ready to use:', fileUri);
      // }
    // env.localModelPath = FileSystem.bundleDirectory + 'models/';
    // env.allowRemoteModels = false;

    // console.log("Local model path set to:", env.localModelPath);
    //   const tokenizer = await AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english");
    //   console.log(tokenizer)
    //   console.log("end");
      // const tokenizer = await AutoTokenizer.from_pretrained("models/bert-base-uncased");
      // await tokenizerAsset.downloadAsync();
      // const tokenizerUri = tokenizerAsset.localUri;
      // const tokenizerJson = await FileSystem.readAsStringAsync(tokenizerUri);
      // const tokenizerConfig = JSON.parse(tokenizerJson);

      // const tokenizerInstance = await AutoTokenizer.from_pretrained({
      //   modelId: 'distilbert-base-uncased-finetuned-sst-2-english',
      //   configPath: tokenizerUri,
      // });

    } catch (e) {
      Alert.alert("failed to inference model in loadTransformerPipelineToken", `${e}`);
      console.log(e)
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
      <Button title="Run Model" onPress={runMNISTModel} />
      <Button title="loadDistilModel" onPress={loadDistilModel}/> 
      <Button title="loadDistilTokenizer" onPress={loadDistilTokenizer}/> 
      <Button title="loadDistilPipelineModel" onPress={loadDistilPipelineModel}/> 
      <Button title="loadTransformerPipelineToken" onPress={loadTransformerPipelineToken}/> 
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
