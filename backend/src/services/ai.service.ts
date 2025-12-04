import { groq, isGroqAvailable } from '../config/groq';

const GROQ_MODEL = 'llama-3.1-70b-versatile';

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  price: number;
  reorder_level?: number;
}

interface SalesData {
  product_id: string;
  quantity_sold?: number;
  revenue?: number;
  date?: string;
}

class AIService {
  async generateInventoryForecast(params: {
    products: Product[];
    salesHistory: SalesData[];
    horizonDays: number;
  }) {
    if (!isGroqAvailable() || !groq) {
      return this.generateMockForecast(params);
    }

    const prompt = `You are an expert inventory analyst. Analyze these products and sales data to forecast demand for the next ${params.horizonDays} days.

Products (Current Stock):
${params.products.map(p => `- ${p.name}: ${p.stock_quantity} units @ ₹${p.price}`).join('\n')}

Recent Sales (Last 90 days):
${params.salesHistory.length} total orders

Generate forecasts with:
1. Expected demand per product
2. Restock recommendations
3. Risk assessment

Return JSON:
{
  "forecasts": [
    {"product_name": "...", "predicted_demand": <number>, "restock_needed": <boolean>, "urgency": "low|medium|high"}
  ],
  "summary": "...",
  "recommendations": ["..."]
}`;

    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are an inventory forecasting AI. Always respond with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Groq forecast error:', error);
      return this.generateMockForecast(params);
    }
  }

  async generateReorderRecommendations(products: Product[]) {
    if (!isGroqAvailable() || !groq) {
      return products.map(p => ({
        product_id: p.id,
        product_name: p.name,
        current_stock: p.stock_quantity,
        recommended_order: Math.max(20 - p.stock_quantity, 10),
        urgency: p.stock_quantity < 5 ? 'high' : 'medium',
        reasoning: `Stock is low at ${p.stock_quantity} units. Recommend ordering to reach safety stock.`,
      }));
    }

    const prompt = `Analyze these low-stock products and provide reorder recommendations:

${products.map(p => `- ${p.name} (ID: ${p.id}): ${p.stock_quantity} units, Price: ₹${p.price}`).join('\n')}

For each product, provide:
1. Recommended order quantity
2. Urgency level (low/medium/high)
3. Brief reasoning

Return JSON array:
[{"product_id": "...", "product_name": "...", "current_stock": <n>, "recommended_order": <n>, "urgency": "...", "reasoning": "..."}]`;

    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a procurement assistant. Respond with valid JSON array only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"recommendations":[]}');
      return result.recommendations || result;
    } catch (error) {
      console.error('Groq recommendation error:', error);
      return products.map(p => ({
        product_id: p.id,
        product_name: p.name,
        current_stock: p.stock_quantity,
        recommended_order: 20,
        urgency: 'medium',
        reasoning: 'AI unavailable - using default recommendation',
      }));
    }
  }

  private generateMockForecast(params: { products: Product[]; horizonDays: number }) {
    return {
      forecasts: params.products.slice(0, 10).map(p => ({
        product_name: p.name,
        predicted_demand: Math.floor(Math.random() * 50) + 10,
        restock_needed: p.stock_quantity < 10,
        urgency: p.stock_quantity < 5 ? 'high' : p.stock_quantity < 10 ? 'medium' : 'low',
      })),
      summary: `${params.horizonDays}-day forecast generated for ${params.products.length} products`,
      recommendations: [
        'Review low-stock items immediately',
        'Consider bulk ordering for high-demand products',
        'Monitor seasonal trends',
      ],
    };
  }
}

export default new AIService();
