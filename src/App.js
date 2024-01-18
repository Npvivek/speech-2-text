import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

const SpeechRecognitionDemo = () => {
  const recognition = useMemo(() => new window.webkitSpeechRecognition(), []);

  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [shouldAppend, setShouldAppend] = useState(true);

  useEffect(() => {
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Speech recognition started...');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (shouldAppend) {
        setRecognizedText(prevText => prevText + ' ' + finalTranscript);
      }

      console.log('Speech recognition result:', finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended...');
      setShouldAppend(true); // Reset the flag when recognition ends
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      // Handle the error as needed
      setShouldAppend(true); // Reset the flag on error
    };

    return () => {
      // Do not abort on unmount to allow continuous recognition
      // recognition.abort();
    };
  }, [recognition, shouldAppend]);

  const startListening = () => {
    if (!isListening) {
      setRecognizedText('');
      setShouldAppend(true); // Reset the flag when starting to listen
      recognition.start();
    }
  };

  const stopListening = () => {
    recognition.stop();
  };

  return (
    <div>
      <h1>Speech Recognition Demo</h1>
      <p>{isListening ? 'Listening...' : 'Click the button to start listening.'}</p>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <p>Recognized Text: {recognizedText}</p>
    </div>
  );
};

export default SpeechRecognitionDemo;
