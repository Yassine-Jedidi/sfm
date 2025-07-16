import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const router = useRouter();
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
          Sign Up
        </Text>
        <View className="w-full max-w-xs mb-4">
          <TextInput
            placeholder="Name"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
          />
          <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 mb-4"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            className="border border-gray-300 rounded px-4 py-2 mb-6"
            secureTextEntry
          />
          <TouchableOpacity className="bg-[#F58220] py-3 rounded-full items-center">
            <Text className="text-white font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
