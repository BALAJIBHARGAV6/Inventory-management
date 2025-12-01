import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

// Sample data for seeding
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'];

const SAMPLE_PRODUCTS = [
  { name: 'Classic T-Shirt', category: 'Apparel', brand: 'BasicWear', basePrice: 799 },
  { name: 'Cotton Polo Shirt', category: 'Apparel', brand: 'BasicWear', basePrice: 1299 },
  { name: 'Denim Jeans', category: 'Apparel', brand: 'UrbanFit', basePrice: 1999 },
  { name: 'Casual Sneakers', category: 'Footwear', brand: 'UrbanFit', basePrice: 2499 },
  { name: 'Running Shoes', category: 'Footwear', brand: 'TechGear', basePrice: 3499 },
  { name: 'Backpack', category: 'Accessories', brand: 'TravelPro', basePrice: 1299 },
  { name: 'Laptop Bag', category: 'Accessories', brand: 'TravelPro', basePrice: 1799 },
  { name: 'Wireless Earbuds', category: 'Electronics', brand: 'TechGear', basePrice: 2999 },
  { name: 'Smart Watch', category: 'Electronics', brand: 'TechGear', basePrice: 4999 },
  { name: 'Leather Wallet', category: 'Accessories', brand: 'StyleHub', basePrice: 899 },
];

const SUPPLIERS = [
  {
    name: 'TextileCorp India',
    email: 'orders@textilecorp.in',
    phone: '+91-9876543210',
    address: 'Plot 45, Industrial Area, Surat, Gujarat 395003',
    paymentTerms: 'Net 30',
    leadTimeDays: 7,
  },
  {
    name: 'FootwearHub Pvt Ltd',
    email: 'procurement@footwearhub.co.in',
    phone: '+91-9123456789',
    address: '23, Sector 18, Gurgaon, Haryana 122001',
    paymentTerms: 'Net 45',
    leadTimeDays: 10,
  },
  {
    name: 'TechWholesale Solutions',
    email: 'orders@techwholesale.in',
    phone: '+91-9988776655',
    address: '12th Floor, Tower A, Electronic City, Bangalore 560100',
    paymentTerms: 'Advance Payment',
    leadTimeDays: 14,
  },
];

async function generateSKU(productName: string, attributes: any): Promise<string> {
  const prefix = productName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();
  const attrStr = Object.values(attributes).join('-').replace(/\s+/g, '-');
  return `${prefix}-${attrStr}-${randomInt(100, 999)}`;
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clean existing data
    console.log('Cleaning existing data...');
    await prisma.inventoryAuditLog.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.supplierPrice.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.forecast.deleteMany();
    await prisma.sales.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.product.deleteMany();

    // Create suppliers
    console.log('Creating suppliers...');
    const createdSuppliers = await Promise.all(
      SUPPLIERS.map(supplier =>
        prisma.supplier.create({
          data: supplier,
        })
      )
    );
    console.log(`✅ Created ${createdSuppliers.length} suppliers\n`);

    // Create products with variants
    console.log('Creating products and variants...');
    let totalVariants = 0;

    for (const productData of SAMPLE_PRODUCTS) {
      const productSKU = await generateSKU(productData.name, {});

      const product = await prisma.product.create({
        data: {
          sku: productSKU,
          name: productData.name,
          description: `High-quality ${productData.name.toLowerCase()} from ${productData.brand}`,
          category: productData.category,
          brand: productData.brand,
          images: [
            `https://placeholder.com/500x500?text=${productData.name.replace(/\s+/g, '+')}`,
          ],
        },
      });

      // Create 2-4 variants per product
      const numVariants = randomInt(2, 5);
      for (let i = 0; i < numVariants; i++) {
        const attributes =
          productData.category === 'Apparel'
            ? {
                size: SIZES[randomInt(0, SIZES.length)],
                color: COLORS[randomInt(0, COLORS.length)],
              }
            : {
                color: COLORS[randomInt(0, COLORS.length)],
              };

        const variantSKU = await generateSKU(productData.name, attributes);
        const priceVariation = randomInt(-200, 300);
        const price = productData.basePrice + priceVariation;
        const costPrice = Math.floor(price * 0.6); // 40% margin

        const variant = await prisma.variant.create({
          data: {
            productId: product.id,
            sku: variantSKU,
            attributes,
            priceInr: price,
            compareAtPriceInr: price + randomInt(100, 500),
            costPriceInr: costPrice,
            weightGrams: randomInt(200, 1000),
          },
        });

        // Create inventory for this variant
        const initialStock = randomInt(10, 100);
        await prisma.inventory.create({
          data: {
            sku: variant.sku,
            qtyAvailable: initialStock,
            safetyStock: randomInt(10, 30),
            reorderPoint: randomInt(20, 50),
            leadTimeDays: randomInt(5, 14),
          },
        });

        // Add supplier prices
        const randomSupplier =
          createdSuppliers[randomInt(0, createdSuppliers.length)];
        await prisma.supplierPrice.create({
          data: {
            supplierId: randomSupplier.id,
            sku: variant.sku,
            unitPriceInr: costPrice - randomInt(50, 150),
            moq: randomInt(10, 50),
          },
        });

        totalVariants++;
      }
    }

    console.log(`✅ Created ${SAMPLE_PRODUCTS.length} products`);
    console.log(`✅ Created ${totalVariants} variants with inventory\n`);

    // Generate historical sales (last 180 days)
    console.log('Generating historical sales (180 days)...');
    const allVariants = await prisma.variant.findMany();
    let totalSales = 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180);

    for (let dayOffset = 0; dayOffset < 180; dayOffset++) {
      const saleDate = new Date(startDate);
      saleDate.setDate(saleDate.getDate() + dayOffset);

      // Is weekend? (More sales)
      const isWeekend = saleDate.getDay() === 0 || saleDate.getDay() === 6;

      // Generate 5-15 sales per day
      const dailySales = randomInt(5, isWeekend ? 20 : 15);

      for (let i = 0; i < dailySales; i++) {
        const variant = allVariants[randomInt(0, allVariants.length)];
        const qty = randomInt(1, 4);

        await prisma.sales.create({
          data: {
            orderId: `ORD-${Date.now()}-${randomInt(1000, 9999)}`,
            sku: variant.sku,
            qty,
            priceInr: variant.priceInr,
            discountInr: randomInt(0, 100),
            soldAt: saleDate,
          },
        });

        totalSales++;
      }
    }

    console.log(`✅ Generated ${totalSales} sales records\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`  - Suppliers: ${createdSuppliers.length}`);
    console.log(`  - Products: ${SAMPLE_PRODUCTS.length}`);
    console.log(`  - Variants: ${totalVariants}`);
    console.log(`  - Sales Records: ${totalSales}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding
seedDatabase();
