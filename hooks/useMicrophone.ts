import { transcribeAudio, validateAudioFile } from '@/services/whisper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseMicrophoneReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  recognizedText: string;
  resetRecognizedText: () => void;
}

export const useMicrophone = (): UseMicrophoneReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recognizedText, setRecognizedText] = useState('');

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
      // Use expo-av for all platforms (web and mobile)
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
      // Stop recording
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        try {
          // Validate audio file before sending
          const isValid = await validateAudioFile(uri);
          if (!isValid) {
            throw new Error('Invalid audio file');
          }

          // Send audio to whisper service for transcription
          setIsTranscribing(true);
          const token = await AsyncStorage.getItem("userToken");
          const userId = await AsyncStorage.getItem("userId");
          const transcript = await transcribeAudio({
            audioUri: uri,
            audioType: 'audio/m4a',
            fileName: 'recording.m4a',
            model: 'whisper-large-v3-turbo',
          }, token || '', userId || '');
          setRecognizedText(transcript);
          console.log('Transcript:', transcript);
        } catch (error) {
          console.error('Transcription failed:', error);
          setRecognizedText('Transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
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
    isTranscribing,
    startRecording,
    stopRecording,
    recognizedText,
    resetRecognizedText,
  };
}; 