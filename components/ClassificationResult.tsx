import React from 'react';
import { QuantitativeClassificationResult, ApiResponseError } from '../types';

interface ClassificationResultProps {
  result: QuantitativeClassificationResult | null;
  error: ApiResponseError | null;
}

const ClassificationResultDisplay: React.FC<ClassificationResultProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative shadow-md" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">{error.message}</span>
        {error.details && <p className="text-sm mt-1">{error.details}</p>}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">Classification Result</h3>
      <div className="space-y-3">
        <p className="text-lg">
          <span className="font-semibold text-blue-600 dark:text-blue-400">Contains Quantitative Data:</span>{' '}
          <span className="text-gray-900 dark:text-gray-200">{result.has_quantitative_data ? 'Yes' : 'No'}</span>
        </p>
        {result.reasoning && (
          <p className="text-lg">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Reasoning:</span>{' '}
            <span className="text-gray-900 dark:text-gray-200 block mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{result.reasoning}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassificationResultDisplay;