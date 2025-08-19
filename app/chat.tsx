import MicrophoneButton from "@/components/MicrophoneButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { sendChatPrompt } from "@/services/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<any>>(null);
  const [loading, setLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const sendMessage = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim();
    if (textToSend === "") return;
    console.log("Sending prompt:", textToSend);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: textToSend, fromMe: true },
    ]);
    setInput("");
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      const data = await sendChatPrompt(textToSend, token || "", userId || "");
      console.log("API response:", data);
      if (data.output) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: data.output, fromMe: false },
        ]);
      }
    } catch (e) {
      console.log("API error:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "How can I help you?",
          fromMe: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextRecognized = (text: string) => {
    // Add the transcribed text output as a system response
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: text, fromMe: false },
    ]);
  };

  const handleTranscribingState = (transcribing: boolean) => {
    setIsTranscribing(transcribing);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 5}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <View
                className={`mb-2 flex-row ${item.fromMe ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    item.fromMe ? "bg-[#22347C]" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={item.fromMe ? "text-white" : "text-gray-800"}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              loading || isTranscribing ? (
                <View className="mb-2 flex-row justify-start">
                  <View className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-200">
                    <View className="flex-row items-center space-x-1">
                      <View className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></View>
                      <View
                        className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></View>
                      <View
                        className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></View>
                    </View>
                  </View>
                </View>
              ) : null
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
          <View className="bg-white flex-row items-center px-4 py-2 border-t border-gray-200">
            <TextInput
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
              editable={!loading}
            />
            <MicrophoneButton
              onTextRecognized={handleTextRecognized}
              disabled={loading || isTranscribing}
              className="mr-2"
              onTranscribingState={handleTranscribingState}
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              className="bg-[#22347C] rounded-full p-2"
              disabled={input.trim() === "" || loading}
            >
              <IconSymbol name="paperplane.fill" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
