'use client';

import Header from '@/components/common/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import OrderSuccessHeader from './OrderSuccessHeader';
import OrderItemCard from './OrderItemCard';
import OrderSummary from './OrderSummary';
import ShippingInfo from './ShippingInfo';
import DeliveryTimeline from './DeliveryTimeline';
import OrderActions from './OrderActions';

export default function OrderConfirmationInteractive({ orderData }) {
  const breadcrumbItems = [
    { label: 'Shopping Cart', path: '/shopping-cart' },
    { label: 'Order Confirmation', path: '/order-confirmation' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <OrderSuccessHeader
            orderNumber={orderData?.orderNumber}
            orderDate={orderData?.orderDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <DeliveryTimeline
                estimatedDelivery={orderData?.estimatedDelivery}
                currentStatus={orderData?.status}
              />

              <div className="bg-card rounded-md border border-border p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Order Items ({orderData?.items?.length})
                </h2>
                <div className="space-y-4">
                  {orderData?.items?.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <OrderSummary
                subtotal={orderData?.subtotal}
                shipping={orderData?.shipping}
                tax={orderData?.tax}
                discount={orderData?.discount}
                total={orderData?.total}
              />
              <ShippingInfo address={orderData?.shippingAddress} />
            </div>
          </div>

          <OrderActions orderNumber={orderData?.orderNumber} />
        </div>
      </main>
    </div>
  );
}
