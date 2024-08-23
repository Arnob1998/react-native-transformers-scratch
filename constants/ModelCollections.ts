
const Llama_160M_Chat_v1_url = "Felladrin/onnx-Llama-160M-Chat-v1"
const Phi_3_mini_4k_url = "microsoft/Phi-3-mini-4k-instruct-onnx-web"

export const ModelCollections = {
    "Llama-160M-Chat-v1":{
        "metadata":"Felladrin/onnx-Llama-160M-Chat-v1",
        "content": [
           {"meta":{"description": "Onnx File"}, "filename": "decoder_model_merged.onnx", "link":"https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/onnx/decoder_model_merged.onnx"},
           {"meta":{"description": "Config File"}, "filename": "config.json", "link":"https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/config.json"},
           {"meta": {"description": "Tokenizer"}, "filename": "tokenizer.json", "link":"https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/tokenizer.json"},
           {"meta": {"description": "Tokenizer Config"}, "filename": "tokenizer_config.json", "link":"https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/tokenizer_config.json"},
           {"meta": {"description": "General Config"}, "filename": "generation_config.json", "link":"https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/generation_config.json"},
        ]
    },
    "Phi-3-mini-4k":{
        "metadata":"microsoft/Phi-3-mini-4k-instruct-onnx-web",
        "content": [
           {"meta":{"description": "Onnx File"}, "filename": "decoder_model_merged.onnx", "link":`https://huggingface.co/${Phi_3_mini_4k_url}/resolve/main/onnx/model_q4f16.onnx`},
           {"meta":{"description": "Config File"}, "filename": "config.json", "link":`https://huggingface.co/${Phi_3_mini_4k_url}/resolve/main/config.json`},
           {"meta": {"description": "Tokenizer"}, "filename": "tokenizer.json", "link":`https://huggingface.co/${Phi_3_mini_4k_url}/resolve/main/tokenizer.json`},
           {"meta": {"description": "Tokenizer Config"}, "filename": "tokenizer_config.json", "link":`https://huggingface.co/${Phi_3_mini_4k_url}/resolve/main/tokenizer_config.json`},
           {"meta": {"description": "General Config"}, "filename": "generation_config.json", "link":`https://huggingface.co/${Phi_3_mini_4k_url}/resolve/main/generation_config.json`},
        ]
    }
  };

  // also do hash checksum  https://huggingface.co/Felladrin/onnx-Llama-160M-Chat-v1/resolve/main/config.json