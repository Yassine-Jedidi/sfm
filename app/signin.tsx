import { IconSymbol } from "@/components/ui/IconSymbol";
import { signIn } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignInScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await signIn(username, password);
      if (data.token) {
        setSuccess("Sign in successful!");
        console.log(data);
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          className="absolute left-4 top-10"
          onPress={() => router.back()}
        >
          <IconSymbol
            name="chevron.right"
            size={28}
            color="#22347C"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
        <Text className="text-[#22347C] text-3xl font-bold mb-8 mt-8">
          Sign In
        </Text>
        <View className="w-full max-w-xs mb-4">
          <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
            keyboardType="email-address"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            className="border border-gray-300 rounded px-4 py-2 mb-6"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
          {success ? (
            <Text className="text-green-600 mb-2">{success}</Text>
          ) : null}
          <TouchableOpacity
            className="bg-[#22347C] py-3 rounded-full items-center"
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text className="text-white font-semibold">
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
