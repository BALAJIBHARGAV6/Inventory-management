export interface ForecastPrediction {
  date: string;
  predicted_qty: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface ForecastSummary {
  total_predicted: number;
  daily_average: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonality_detected: boolean;
}

export interface ReorderRecommendation {
  should_reorder: boolean;
  suggested_qty: number;
  reasoning: string;
}

export interface ForecastResult {
  predictions: ForecastPrediction[];
  summary: ForecastSummary;
  explanation: string;
  reorder_recommendation: ReorderRecommendation;
}

export interface POLineItem {
  sku: string;
  product_name: string;
  qty: number;
  unit_price_inr: number;
  total_inr: number;
}

export interface PODraftResult {
  recommended_quantities: Array<{
    sku: string;
    qty: number;
    total_inr: number;
  }>;
  total_order_value_inr: number;
  email_subject: string;
  email_body: string;
  reasoning: string;
  expected_delivery_date: string;
}

export interface InventoryRecommendation {
  should_reorder: boolean;
  suggested_qty: number;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high';
}
