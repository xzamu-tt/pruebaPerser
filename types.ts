export interface ClassificationResult {
  category: string;
  confidence?: number;
  reasoning?: string;
}

export interface QuantitativeClassificationResult {
  has_quantitative_data: boolean;
  reasoning?: string;
}

export interface ApiResponseError {
  message: string;
  details?: string;
}
