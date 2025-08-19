import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMicrophone } from "@/hooks/useMicrophone";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";

interface MicrophoneButtonProps {
  onTextRecognized?: (text: string) => void;
  onTranscribingState?: (transcribing: boolean) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  showRecordingIndicator?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  onTextRecognized,
  onTranscribingState,
  disabled = false,
  size = 24,
  className = "",
  showRecordingIndicator = true,
}) => {
  const {
    isRecording,
    isTranscribing,
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

  // Handle transcription state changes
  React.useEffect(() => {
    if (onTranscribingState) {
      onTranscribingState(isTranscribing);
    }
  }, [isTranscribing, onTranscribingState]);

  // Handle recording animation
  React.useEffect(() => {
    if ((isRecording || isTranscribing) && showRecordingIndicator) {
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
  }, [isRecording, isTranscribing, showRecordingIndicator, pulseAnim]);

  const handlePress = async () => {
    if (disabled || isTranscribing) return;

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const getIconName = () => {
    if (isTranscribing) return "hourglass";
    return isRecording ? "stop" : "mic.fill";
  };

  const getIconColor = () => {
    if (isTranscribing) return "#FFA500"; // Orange for transcribing
    if (isRecording) return "#FF0000"; // Red for recording
    return "#22347C"; // Default blue
  };

  return (
    <View className={`relative ${className}`}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || isTranscribing}
          className={`rounded-full p-2 ${
            isRecording || isTranscribing ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          <IconSymbol
            name={getIconName() as any}
            size={size}
            color={getIconColor()}
          />
        </TouchableOpacity>
      </Animated.View>

      {isTranscribing && (
        <View className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"></View>
      )}
    </View>
  );
};

export default MicrophoneButton;
