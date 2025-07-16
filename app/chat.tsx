import { IconSymbol } from "@/components/ui/IconSymbol";
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

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input, fromMe: true },
    ]);
    setInput("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
            keyExtractor={(item) => item.id}
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
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="bg-[#22347C] rounded-full p-2"
              disabled={input.trim() === ""}
            >
              <IconSymbol name="paperplane.fill" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
