import { api2 } from './api';

export interface WhisperTranscriptionResponse {
  transcript?: string;
  text?: string;
  error?: string;
  output?: string;
}

export interface WhisperTranscriptionRequest {
  audioUri: string;
  audioType?: string;
  fileName?: string;
  model?: string;
}

/**
 * Send audio file to Whisper transcription webhook
 * @param request - The transcription request containing audio file details
 * @returns Promise with transcription result
 */
export const transcribeAudio = async (
  request: WhisperTranscriptionRequest,
  token: string,
  userId: string
): Promise<string> => {
  try {
    // Create form data with the audio file
    const formData = new FormData();
    
    // Add model parameter first (required by Groq API)
    formData.append('model', 'whisper-large-v3-turbo');
    
    // Add response format
    formData.append('response_format', 'json');
    
    // Add audio file
    formData.append('file', {
      uri: request.audioUri,
      type: request.audioType || 'audio/m4a',
      name: request.fileName || 'recording.m4a',
    } as any);

    // Make HTTP request to the webhook endpoint using api2
    const response = await api2.post<WhisperTranscriptionResponse>(
      '/webhook-test/whisper-transcription',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'idUser': userId,
        },
      }
    );

    const result = response.data;
    console.log('result:', result);
    // Handle potential error in response
    if (result?.error) {
      throw new Error(result.error);
    }
    console.log('Whisper transcription result:', result);
    // Return transcript or text, fallback to completion message
    return result.transcript || result.text || result.output || '';
  } catch (error) {
    console.error('Whisper transcription error:', error);
    
    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error.message.includes('404')) {
        throw new Error('Transcription service not found. Please contact support.');
      } else if (error.message.includes('500')) {
        throw new Error('Transcription service error. Please try again later.');
      } else if (error.message.includes('413')) {
        throw new Error('Audio file too large. Please record a shorter message.');
      } else if (error.message.includes('model is a required property')) {
        throw new Error('Transcription service configuration error. Please contact support.');
      }
    }
    
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

/**
 * Validate audio file before sending to transcription service
 * @param audioUri - The URI of the audio file
 * @returns Promise<boolean> - Whether the audio file is valid
 */
export const validateAudioFile = async (audioUri: string): Promise<boolean> => {
  try {
    // Basic validation - check if URI exists
    if (!audioUri) {
      return false;
    }

    // For web platform, we can check if the file exists
    if (typeof window !== 'undefined') {
      const response = await fetch(audioUri, { method: 'HEAD' });
      return response.ok;
    }

    // For mobile platforms, assume the URI is valid if it exists
    return true;
  } catch (error) {
    console.error('Audio file validation error:', error);
    return false;
  }
};

/**
 * Get supported audio formats for transcription
 * @returns Array of supported MIME types
 */
export const getSupportedAudioFormats = (): string[] => {
  return [
    'audio/m4a',
    'audio/mp3',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/mp4',
  ];
};

/**
 * Check if audio format is supported
 * @param mimeType - The MIME type to check
 * @returns boolean - Whether the format is supported
 */
export const isAudioFormatSupported = (mimeType: string): boolean => {
  return getSupportedAudioFormats().includes(mimeType);
}; 