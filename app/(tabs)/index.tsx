import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  View,
  Button,
} from "react-native";

import { useEffect } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// import { Pipeline } from "react-native-transformers";
import * as ort from "onnxruntime-react-native";
import { Asset, useAssets } from "expo-asset";
import { tokenizer } from '@/constants/tokenizer';
import * as FileSystem from 'expo-file-system';
import { env, AutoTokenizer, PreTrainedTokenizer, pipeline, AutoModel } from "@xenova/transformers";
import { InferenceSession } from 'onnxruntime-react-native';

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
    } catch (e) {
      Alert.alert("failed to inference model in loadTransformerPipelineToken", `${e}`);
      console.log(e)
      throw e;
    }
  };


  const loadSmolLM360MInstructTransformerPipeline = async () => {
    try {
      const tokenizer_url = 'https://raw.githubusercontent.com/Arnob1998/react-native-transformers-scratch/main/assets/SmolLM-360M-Instruct/tokenizer.json';
      const tokenizer_filename = 'tokenizer.json';
      const tokenizer_config_filename = 'tokenizer_config.json';
      const tokenizer_config_url = "https://raw.githubusercontent.com/Arnob1998/react-native-transformers-scratch/main/assets/SmolLM-360M-Instruct/tokenizer_config.json"
      const folderName = 'SmolLM-360M-Instruct';

      const tokenizerfileUri = await saveFileToFolder(tokenizer_url, folderName, tokenizer_filename);
      const tokenizer_configUri = await saveFileToFolder(tokenizer_config_url, folderName, tokenizer_config_filename);
  
      if (tokenizerfileUri && tokenizer_configUri) {
        // You can now use the fileUri to read or process the file later
        console.log('File is ready to use:', tokenizerfileUri, tokenizer_configUri);

        env.localModelPath = FileSystem.documentDirectory;
        env.allowRemoteModels = false; 
        const messages = [{"role": "user", "content": "What is the capital of France."}]
        console.log("Local model path set to:", env.localModelPath);
        const tokenizer = await AutoTokenizer.from_pretrained(folderName);
        const tokens = tokenizer.apply_chat_template(messages, tokenize=false)
        console.log("tokens", tokens);

              // Convert tokens to ONNX tensors
      const inputIdsTensor = new ort.Tensor('int64', tokens.data, tokens.dims);
      const attentionMask = new Array(tokens.dims[1]).fill(1); // Assuming attention mas
      // Generate position_ids (0, 1, 2, ..., n-1)
      const positionIds = Array.from({ length: tokens.dims[1] }, (_, i) => i);
      const positionIdsTensor = new ort.Tensor('int64', positionIds, [1, tokens.dims[1]]);

      console.log("inputIdsTensor", inputIdsTensor);
      console.log("attentionMask", attentionMask);


      const feeds = {
        input_ids: inputIdsTensor,
        attention_mask: new ort.Tensor('int64', attentionMask, [1, tokens.dims[1]]),
        position_ids: positionIdsTensor
      };
      
      console.log("loading the model")
      // Load ONNX model
      const assets = await Asset.loadAsync(require("@/assets/SmolLM-360M-Instruct/model_quantized.onnx"));
      const modelUri = assets[0].localUri;

      if (!modelUri) {
        console.log("Failed to get model URI", `${assets[0]}`);
        return;
      }

      const myModel = await ort.InferenceSession.create(modelUri);
      console.log("Model loaded successfully. Input names:", myModel.inputNames, "Output names:", myModel.outputNames);

      // Run inference
      const results = await myModel.run(feeds);
      console.log("Inference results:", results);

        // console.log("loading model");
        // const assets = await Asset.loadAsync(require("@/assets/SmolLM-360M-Instruct/model_quantized.onnx"));
        // const modelUri = assets[0].localUri;
        // console.log("modelUri ", modelUri);
        // if (!modelUri) {
        //   console.log("failed to get model URI", `${assets[0]}`);
        // } 
        //   // load model from model url path
        //   myModel = await ort.InferenceSession.create(modelUri);
        //   console.log(
        //     "model loaded successfully",
        //     `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`)
        // // Run inference
        // const results = await myModel.run(tokens);
        // console.log(results);
      }
    } catch (e) {
      Alert.alert("failed to inference model in loadTransformerPipelineToken", `${e}`);
      console.log(e)
      throw e;
    }
  };

  const autoSmolLM360MInstructPipeline = async () => {
    try {
      const config_url = 'https://drive.google.com/uc?export=download&id=1-6Eh3FMeMlBycs09y59pQtAR0ffmEUtp';
      const config_filename = 'config.json';
      const tokenizer_url = 'https://drive.google.com/uc?export=download&id=1-N-3s4qtM45lk33y8Oc6KTV6VnPCB2YW';
      const tokenizer_filename = 'tokenizer.json';
      const tokenizer_config_filename = 'tokenizer_config.json';
      const tokenizer_config_url = "https://drive.google.com/uc?export=download&id=1-F9jFH_uWPuaoUhFJY2HxiNvDxzK2kE_"
      const model_quantized_filename = 'decoder_model_merged_quantized.onnx';
      const model_quantized_config_url = "https://drive.google.com/file/d/1-D9hC4XNnI8yHwRfg1L7qp8KXZH7BF5e/view?usp=sharing"
      const folderName = 'SmolLM-360M-Instruct';
      const model_quantizedfolderName = 'SmolLM-360M-Instruct/onnx/';

      const configfileUri = await saveFileToFolder(config_url, folderName, config_filename);
      console.log("configfileUri downloaded")
      const tokenizerfileUri = await saveFileToFolder(tokenizer_url, folderName, tokenizer_filename);
      console.log("tokenizerfileUri downloaded")
      const tokenizer_configUri = await saveFileToFolder(tokenizer_config_url, folderName, tokenizer_config_filename);
      console.log("tokenizer_configUri downloaded")
      const model_quantizedUri = await saveFileToFolder(model_quantized_config_url, model_quantizedfolderName, model_quantized_filename);
      console.log("model_quantizedUri downloaded")

      if (tokenizerfileUri && tokenizer_configUri && model_quantizedUri && configfileUri) {
        // You can now use the fileUri to read or process the file later
        console.log('Files is ready to use');

        env.localModelPath = FileSystem.documentDirectory;
        env.allowRemoteModels = false; 
        console.log("Local model path set to:", env.localModelPath);

        
        const model = await AutoModel.from_pretrained(folderName, {
          backend: 'onnx',
          // Pass the session creation logic if required
          sessionOptions: {
            executionProviders: ['cpu'], // Example, use 'cpu' or 'cuda' depending on your setup
          },
          onnx: {
            session: new InferenceSession({ backend: 'cpu' }),
          },
        });
        const tokenizer = await AutoTokenizer.from_pretrained(folderName);

        console.log(model, tokenizer)


      }


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
      <Button title="loadSmolLM360MInstructTransformerPipeline" onPress={loadSmolLM360MInstructTransformerPipeline}/>
      <Button title="autoSmolLM360MInstructPipeline" onPress={autoSmolLM360MInstructPipeline}/>
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
