import { create } from "zustand";

console.log("zustand models init")

export const useModelStore = create((set,get) => ({
  model: "Phi-3-mini-4k",
  setModel: (model) => set((state) => ({
    model :model
  })),
}));