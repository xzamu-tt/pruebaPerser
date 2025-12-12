import React, { useState } from 'react';

interface JsonInputProps {
  onSubmit: (json: string) => void;
  isLoading: boolean;
}

const JsonInput: React.FC<JsonInputProps> = ({ onSubmit, isLoading }) => {
  const [jsonString, setJsonString] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!jsonString.trim()) {
      setError('JSON input cannot be empty.');
      return;
    }
    try {
      JSON.parse(jsonString); // Validate JSON format
      onSubmit(jsonString);
    } catch (err) {
      setError('Invalid JSON format. Please enter valid JSON.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter JSON Data:
        </label>
        <textarea
          id="jsonInput"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y min-h-[150px] md:min-h-[250px]"
          placeholder='E.g., {"title": "Latest AI Breakthrough", "content": "Scientists have achieved a new milestone in AI research..."}'
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          rows={10}
          disabled={isLoading}
        ></textarea>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Classifying...
          </span>
        ) : (
          'Classify Text'
        )}
      </button>
    </form>
  );
};

export default JsonInput;