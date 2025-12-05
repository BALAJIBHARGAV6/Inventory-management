/**
 * AI Product Recommendations Service
 * Suggests new products to add based on Indian market trends, seasonality, and sales data
 */

interface ProductRecommendation {
  name: string;
  category: string;
  price_range: string;
  expected_demand: string;
  seasonal_factor: number;
  market_trend: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  investment_required: number;
  expected_roi: string;
  target_audience: string;
  competition_level: string;
  launch_timing: string;
}

export class ProductRecommendationsService {
  
  async generateRecommendations(currentProducts: any[], season: string, marketData: any) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Analyze current product gaps
    const productGaps = this.analyzeProductGaps(currentProducts);
    
    // Get seasonal recommendations
    const seasonalRecs = this.getSeasonalRecommendations(season, currentMonth);
    
    // Get trending products in Indian market
    const trendingRecs = this.getTrendingProducts(currentMonth);
    
    // Get festival-specific recommendations
    const festivalRecs = this.getFestivalRecommendations(currentMonth);
    
    // Combine and prioritize recommendations
    const allRecommendations = [
      ...productGaps,
      ...seasonalRecs,
      ...trendingRecs,
      ...festivalRecs
    ];
    
    // Remove duplicates and prioritize
    const uniqueRecs = this.prioritizeRecommendations(allRecommendations);
    
    return {
      recommendations: uniqueRecs.slice(0, 8), // Top 8 recommendations
      market_insights: this.getMarketInsights(currentMonth),
      seasonal_trends: this.getSeasonalTrends(season),
      generated_at: new Date().toISOString(),
      next_review: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  private analyzeProductGaps(currentProducts: any[]): ProductRecommendation[] {
    const categories = this.categorizeProducts(currentProducts);
    const gaps: ProductRecommendation[] = [];
    
    // Electronics gaps
    if (!this.hasProduct(currentProducts, ['tablet', 'ipad'])) {
      gaps.push({
        name: 'Apple iPad 10th Generation',
        category: 'Electronics',
        price_range: '₹35,000 - ₹45,000',
        expected_demand: 'High',
        seasonal_factor: 1.3,
        market_trend: 'Growing tablet market for education and work',
        reasoning: 'Missing tablet category. High demand from students and professionals. Apple brand has strong Indian presence.',
        priority: 'high',
        investment_required: 350000,
        expected_roi: '25-30%',
        target_audience: 'Students, Professionals, Creative workers',
        competition_level: 'Medium',
        launch_timing: 'Immediate - before academic season'
      });
    }
    
    if (!this.hasProduct(currentProducts, ['smartwatch', 'watch'])) {
      gaps.push({
        name: 'Samsung Galaxy Watch 6',
        category: 'Electronics',
        price_range: '₹25,000 - ₹35,000',
        expected_demand: 'Very High',
        seasonal_factor: 1.4,
        market_trend: 'Fitness and health consciousness rising',
        reasoning: 'Smartwatch market exploding in India. Health tracking demand post-pandemic. Samsung has strong ecosystem.',
        priority: 'high',
        investment_required: 250000,
        expected_roi: '30-35%',
        target_audience: 'Fitness enthusiasts, Tech-savvy professionals',
        competition_level: 'High',
        launch_timing: 'Immediate - fitness season'
      });
    }
    
    // Fashion gaps
    if (!this.hasProduct(currentProducts, ['sneakers', 'shoes'])) {
      gaps.push({
        name: 'Nike Air Force 1 Sneakers',
        category: 'Fashion',
        price_range: '₹8,000 - ₹12,000',
        expected_demand: 'High',
        seasonal_factor: 1.2,
        market_trend: 'Sneaker culture growing in tier-2 cities',
        reasoning: 'Missing footwear category. Sneaker trend strong among youth. Nike brand aspirational in India.',
        priority: 'medium',
        investment_required: 150000,
        expected_roi: '20-25%',
        target_audience: 'Youth, College students, Urban professionals',
        competition_level: 'High',
        launch_timing: 'Before festival season'
      });
    }
    
    return gaps;
  }
  
  private getSeasonalRecommendations(season: string, month: number): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    
    if (season === 'winter' || month === 12 || month === 1) {
      recommendations.push({
        name: 'Xiaomi Mi Air Purifier 3H',
        category: 'Home & Living',
        price_range: '₹12,000 - ₹18,000',
        expected_demand: 'Very High',
        seasonal_factor: 1.6,
        market_trend: 'Winter pollution drives air purifier demand',
        reasoning: 'Winter pollution in North India creates massive demand. Health consciousness post-COVID. Xiaomi offers value pricing.',
        priority: 'high',
        investment_required: 180000,
        expected_roi: '35-40%',
        target_audience: 'Health-conscious families, Urban households',
        competition_level: 'Medium',
        launch_timing: 'Immediate - peak pollution season'
      });
      
      recommendations.push({
        name: 'Uniqlo Heattech Winter Wear',
        category: 'Fashion',
        price_range: '₹1,500 - ₹3,500',
        expected_demand: 'High',
        seasonal_factor: 1.4,
        market_trend: 'Premium winter wear gaining popularity',
        reasoning: 'Winter season demand. Uniqlo Heattech technology popular. Premium but affordable positioning.',
        priority: 'medium',
        investment_required: 100000,
        expected_roi: '25-30%',
        target_audience: 'Urban professionals, Fashion-conscious consumers',
        competition_level: 'Low',
        launch_timing: 'Immediate - winter season'
      });
    }
    
    if (month >= 3 && month <= 5) { // Summer approaching
      recommendations.push({
        name: 'Blue Star Window AC 1.5 Ton',
        category: 'Home & Living',
        price_range: '₹25,000 - ₹35,000',
        expected_demand: 'Very High',
        seasonal_factor: 1.8,
        market_trend: 'Summer AC demand peaks in March-May',
        reasoning: 'Pre-summer AC purchases surge. Blue Star trusted Indian brand. Window ACs popular in tier-2/3 cities.',
        priority: 'high',
        investment_required: 400000,
        expected_roi: '30-35%',
        target_audience: 'Middle-class families, Tier-2/3 city customers',
        competition_level: 'High',
        launch_timing: 'February-March - before peak summer'
      });
    }
    
    return recommendations;
  }
  
  private getTrendingProducts(month: number): ProductRecommendation[] {
    return [
      {
        name: 'Nothing Phone 2a',
        category: 'Electronics',
        price_range: '₹25,000 - ₹30,000',
        expected_demand: 'High',
        seasonal_factor: 1.2,
        market_trend: 'Nothing brand creating buzz in India',
        reasoning: 'Nothing Phone gaining popularity among tech enthusiasts. Unique design, competitive pricing. Strong social media presence.',
        priority: 'medium',
        investment_required: 300000,
        expected_roi: '20-25%',
        target_audience: 'Tech enthusiasts, Young professionals, Early adopters',
        competition_level: 'Medium',
        launch_timing: 'Q1 2024 - new product cycle'
      },
      
      {
        name: 'boAt Airdopes 800 TWS',
        category: 'Electronics',
        price_range: '₹2,000 - ₹4,000',
        expected_demand: 'Very High',
        seasonal_factor: 1.3,
        market_trend: 'boAt dominating Indian audio market',
        reasoning: 'boAt is #1 audio brand in India. TWS earbuds massive growth. Affordable premium positioning perfect for Indian market.',
        priority: 'high',
        investment_required: 80000,
        expected_roi: '40-45%',
        target_audience: 'Youth, Students, Fitness enthusiasts, Music lovers',
        competition_level: 'High',
        launch_timing: 'Immediate - consistent demand'
      },
      
      {
        name: 'Levi\'s 511 Slim Fit Jeans',
        category: 'Fashion',
        price_range: '₹3,000 - ₹5,000',
        expected_demand: 'High',
        seasonal_factor: 1.1,
        market_trend: 'Denim always in demand, Levi\'s aspirational',
        reasoning: 'Levi\'s iconic brand in India. Jeans are wardrobe staple. 511 fit popular among Indian body types.',
        priority: 'medium',
        investment_required: 120000,
        expected_roi: '22-28%',
        target_audience: 'College students, Young professionals, Fashion-conscious men',
        competition_level: 'High',
        launch_timing: 'Before college season'
      }
    ];
  }
  
  private getFestivalRecommendations(month: number): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    
    // Diwali season (October-November)
    if (month >= 9 && month <= 11) {
      recommendations.push({
        name: 'Philips LED String Lights',
        category: 'Home & Living',
        price_range: '₹500 - ₹2,000',
        expected_demand: 'Very High',
        seasonal_factor: 2.0,
        market_trend: 'Festival decoration demand peaks',
        reasoning: 'Diwali season drives massive demand for decorative lights. Philips trusted for quality. High margin product.',
        priority: 'high',
        investment_required: 50000,
        expected_roi: '50-60%',
        target_audience: 'All households celebrating Diwali',
        competition_level: 'Low',
        launch_timing: 'September - before festival season'
      });
      
      recommendations.push({
        name: 'Tanishq Gold Plated Jewelry',
        category: 'Fashion',
        price_range: '₹2,000 - ₹10,000',
        expected_demand: 'Very High',
        seasonal_factor: 1.9,
        market_trend: 'Festival jewelry purchases traditional',
        reasoning: 'Diwali jewelry shopping tradition. Tanishq most trusted jewelry brand. Gold plated affordable luxury.',
        priority: 'high',
        investment_required: 200000,
        expected_roi: '35-40%',
        target_audience: 'Women, Festival shoppers, Gift buyers',
        competition_level: 'Medium',
        launch_timing: 'September - Dhanteras preparation'
      });
    }
    
    return recommendations;
  }
  
  private hasProduct(products: any[], keywords: string[]): boolean {
    return products.some(product => 
      keywords.some(keyword => 
        product.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  
  private categorizeProducts(products: any[]) {
    return {
      electronics: products.filter(p => p.category_id === '11111111-1111-1111-1111-111111111111').length,
      fashion: products.filter(p => p.category_id === '22222222-2222-2222-2222-222222222222').length,
      home: products.filter(p => p.category_id === '33333333-3333-3333-3333-333333333333').length,
      sports: products.filter(p => p.category_id === '44444444-4444-4444-4444-444444444444').length
    };
  }
  
  private prioritizeRecommendations(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    // Remove duplicates by name
    const unique = recommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.name === rec.name)
    );
    
    // Sort by priority and seasonal factor
    return unique.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority] * a.seasonal_factor;
      const bPriority = priorityWeight[b.priority] * b.seasonal_factor;
      return bPriority - aPriority;
    });
  }
  
  private getMarketInsights(month: number) {
    return {
      current_trends: [
        'Health and fitness products seeing 40% growth',
        'Premium electronics demand rising in tier-2 cities',
        'Sustainable and eco-friendly products gaining traction',
        'Audio products (TWS, headphones) showing consistent growth'
      ],
      consumer_behavior: {
        online_preference: 'Very High (85%)',
        price_sensitivity: 'Medium',
        brand_consciousness: 'High',
        review_dependency: 'Very High'
      },
      market_size: {
        electronics: '₹1.2 trillion',
        fashion: '₹800 billion',
        home_living: '₹400 billion'
      }
    };
  }
  
  private getSeasonalTrends(season: string) {
    const trends = {
      winter: {
        hot_categories: ['Electronics', 'Home Appliances', 'Winter Fashion'],
        growth_rate: '25-30%',
        key_drivers: ['Festival season', 'Pollution concerns', 'Cold weather needs']
      },
      summer: {
        hot_categories: ['Cooling appliances', 'Summer fashion', 'Travel accessories'],
        growth_rate: '35-40%',
        key_drivers: ['Heat wave preparation', 'Summer vacations', 'Cooling needs']
      },
      monsoon: {
        hot_categories: ['Waterproof accessories', 'Indoor entertainment', 'Health products'],
        growth_rate: '20-25%',
        key_drivers: ['Monsoon preparation', 'Indoor activities', 'Health concerns']
      }
    };
    
    return trends[season] || trends.winter;
  }
}

export const productRecommendationsService = new ProductRecommendationsService();
