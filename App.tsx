import React, { useState, useCallback } from 'react';
import JsonInput from './components/JsonInput';
import ClassificationResultDisplay from './components/ClassificationResult';
import { classifyJsonText } from './services/geminiService';
import { QuantitativeClassificationResult, ApiResponseError } from './types';

function App() {
  const [classificationResult, setClassificationResult] = useState<QuantitativeClassificationResult | null>(null);
  const [error, setError] = useState<ApiResponseError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJsonSubmit = useCallback(async (jsonString: string) => {
    setIsLoading(true);
    setError(null);
    setClassificationResult(null); // Clear previous results

    try {
      const result = await classifyJsonText(jsonString);
      setClassificationResult(result);
    } catch (err: any) {
      if (err.message || err.details) {
        setError(err as ApiResponseError);
      } else {
        setError({ message: 'An unknown error occurred during classification.' });
      }
      console.error("Error in App.tsx:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-blue-600 dark:text-blue-400 drop-shadow-md">
        JSON Text Classifier
      </h1>
      <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
        Paste your JSON data below to get an instant text classification using the Gemini API.
        The app will analyze the content and categorize it for you.
      </p>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-8">
        <JsonInput onSubmit={handleJsonSubmit} isLoading={isLoading} />
        
        {(classificationResult || error) && (
          <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
            <ClassificationResultDisplay result={classificationResult} error={error} />
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        Powered by Gemini API & React with Tailwind CSS
      </footer>
    </div>
  );
}

export default App;