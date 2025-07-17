import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface UseMicrophoneReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  recognizedText: string;
  resetRecognizedText: () => void;
}

export const useMicrophone = (): UseMicrophoneReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [recognizedText, setRecognizedText] = useState('');

  // Initialize speech recognition for web
  useEffect(() => {
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        Alert.alert('Error', 'Speech recognition failed. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Request audio permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Microphone permission is required to use voice input.');
      return false;
    }
    return true;
  };

  // Start recording
  const startRecording = async (): Promise<void> => {
    try {
      if (Platform.OS === 'web' && recognition) {
        // Use Web Speech API for web
        recognition.start();
        setIsRecording(true);
        return;
      }

      // Use expo-av for mobile platforms
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  // Stop recording and process speech
  const stopRecording = async (): Promise<void> => {
    try {
      if (Platform.OS === 'web' && recognition) {
        // Stop web speech recognition
        recognition.stop();
        return;
      }

      // Stop mobile recording
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // For mobile platforms, we'll show a placeholder
        // In a real app, you would send the audio file to a speech-to-text service
        const text = "Voice input detected (speech-to-text would be implemented here)";
        setRecognizedText(text);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  // Reset recognized text
  const resetRecognizedText = (): void => {
    setRecognizedText('');
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    recognizedText,
    resetRecognizedText,
  };
}; 