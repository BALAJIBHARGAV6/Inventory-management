import { openai } from '../config/openai';
import type { ForecastResult, PODraftResult } from '../types';

interface HistoricalSale {
  date: string;
  qty: number;
  price: number;
}

interface ForecastParams {
  sku: string;
  historicalSales: HistoricalSale[];
  horizonDays: 30 | 60 | 90;
  currentInventory: number;
  safetyStock: number;
}

interface PODraftParams {
  supplier: {
    name: string;
    email: string;
    leadTimeDays: number;
  };
  lineItems: Array<{
    sku: string;
    productName: string;
    currentStock: number;
    forecastedDemand: number;
    safetyStock: number;
    unitPrice: number;
  }>;
  reason: string;
}

export class OpenAIService {
  /**
   * Generate demand forecast using GPT-4 with historical sales data
   */
  async generateForecast(params: ForecastParams): Promise<ForecastResult> {
    const prompt = `You are an expert inventory analyst. Analyze the following sales data and generate a ${params.horizonDays}-day demand forecast.

**Product SKU:** ${params.sku}
**Current Inventory:** ${params.currentInventory} units
**Safety Stock Requirement:** ${params.safetyStock} units

**Historical Sales Data (Last ${params.historicalSales.length} Days):**
${params.historicalSales.map(s => `${s.date}: ${s.qty} units sold @ ₹${s.price}`).join('\n')}

Generate a forecast with:
1. Daily predicted quantities for the next ${params.horizonDays} days
2. Confidence intervals (lower/upper bounds)
3. Plain-English explanation of demand trends
4. Reorder recommendation with reasoning

Return ONLY valid JSON in this exact format:
{
  "predictions": [
    {"date": "YYYY-MM-DD", "predicted_qty": <number>, "confidence_lower": <number>, "confidence_upper": <number>}
  ],
  "summary": {
    "total_predicted": <number>,
    "daily_average": <number>,
    "trend": "increasing|stable|decreasing",
    "seasonality_detected": <boolean>
  },
  "explanation": "<detailed reasoning>",
  "reorder_recommendation": {
    "should_reorder": <boolean>,
    "suggested_qty": <number>,
    "reasoning": "<why this quantity>"
  }
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a precise inventory forecasting assistant. Always respond with valid JSON only. Use statistical reasoning and consider trends, seasonality, and recent velocity changes.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const forecastData = JSON.parse(
        response.choices[0].message.content!
      ) as ForecastResult;
      return forecastData;
    } catch (error) {
      console.error('OpenAI forecast generation error:', error);
      throw new Error('Failed to generate forecast');
    }
  }

  /**
   * Generate Purchase Order draft with reasoning
   */
  async generatePODraft(params: PODraftParams): Promise<PODraftResult> {
    const prompt = `You are a procurement assistant for an Indian e-commerce company. Generate a professional purchase order draft.

**Supplier:** ${params.supplier.name} (${params.supplier.email})
**Lead Time:** ${params.supplier.leadTimeDays} days

**Items to Order:**
${params.lineItems
  .map(
    item => `
- **${item.productName}** (SKU: ${item.sku})
  - Current Stock: ${item.currentStock} units
  - 30-Day Forecast: ${item.forecastedDemand} units
  - Safety Stock: ${item.safetyStock} units
  - Unit Price: ₹${item.unitPrice}
`
  )
  .join('\n')}

**Reason for Order:** ${params.reason}

Generate:
1. Recommended order quantities for each item (consider lead time, forecast, safety stock)
2. Professional email subject line
3. Complete email body in business format (Indian English style)
4. Detailed reasoning for why these quantities are recommended

Return ONLY valid JSON:
{
  "recommended_quantities": [
    {"sku": "<sku>", "qty": <number>, "total_inr": <number>}
  ],
  "total_order_value_inr": <number>,
  "email_subject": "<subject>",
  "email_body": "<formatted email body with ₹ symbol>",
  "reasoning": "<detailed explanation of qty calculations>",
  "expected_delivery_date": "YYYY-MM-DD"
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert procurement assistant. Calculate optimal order quantities considering lead times and forecast accuracy. Be conservative to avoid overstocking. Use Indian Rupee (₹) symbol and Indian business communication style.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content!) as PODraftResult;
    } catch (error) {
      console.error('OpenAI PO draft generation error:', error);
      throw new Error('Failed to generate PO draft');
    }
  }

  /**
   * Generate plain-English explanation for inventory status
   */
  async explainInventoryStatus(params: {
    sku: string;
    productName: string;
    currentStock: number;
    safetyStock: number;
    reorderPoint: number;
    recentSales: number;
    forecast: number;
  }): Promise<string> {
    const prompt = `Explain the current inventory situation for this product in 2-3 concise bullet points:

Product: ${params.productName} (${params.sku})
Current Stock: ${params.currentStock}
Safety Stock: ${params.safetyStock}
Reorder Point: ${params.reorderPoint}
Last 7 Days Sales: ${params.recentSales}
Next 30 Days Forecast: ${params.forecast}

Provide:
- Current status (healthy/low/critical)
- Recommended action
- Risk assessment`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.5,
      });

      return response.choices[0].message.content || 'No explanation available';
    } catch (error) {
      console.error('OpenAI inventory explanation error:', error);
      return 'Unable to generate explanation';
    }
  }
}

export default new OpenAIService();
