import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMicrophone } from "@/hooks/useMicrophone";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";

interface MicrophoneButtonProps {
  onTextRecognized?: (text: string) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  showRecordingIndicator?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  onTextRecognized,
  disabled = false,
  size = 24,
  className = "",
  showRecordingIndicator = true,
}) => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    recognizedText,
    resetRecognizedText,
  } = useMicrophone();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Handle text recognition
  React.useEffect(() => {
    if (recognizedText && onTextRecognized) {
      onTextRecognized(recognizedText);
      resetRecognizedText();
    }
  }, [recognizedText, onTextRecognized, resetRecognizedText]);

  // Handle recording animation
  React.useEffect(() => {
    if (isRecording && showRecordingIndicator) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim, showRecordingIndicator]);

  const handlePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const buttonStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <View>
      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          onPress={handlePress}
          className={`rounded-full p-2 ${isRecording ? "bg-red-500" : "bg-gray-400"} ${className}`}
          disabled={disabled}
        >
          <IconSymbol name="mic.fill" size={size} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      {isRecording && showRecordingIndicator && (
        <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
      )}
    </View>
  );
};

export default MicrophoneButton;
