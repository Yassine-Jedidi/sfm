import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      {/* Logo */}
      <View className="mb-8">
        <Image
          source={require("@/assets/images/sfm.png")}
          resizeMode="contain"
          className="w-40 h-40"
        />
      </View>
      <Text className="text-[#22347C] text-3xl font-bold mb-2">
        Welcome to SFM
      </Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="bg-[#F58220] px-6 py-3 rounded-full"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#22347C] px-6 py-3 rounded-full"
          onPress={() => router.push("/signin")}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
