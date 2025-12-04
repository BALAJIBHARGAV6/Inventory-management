import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 bg-muted rounded-full flex items-center justify-center">
        <Icon name="ShoppingCartIcon" size={64} className="text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-2">
        Your Cart is Empty
      </h2>

      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
      </p>

      <Link
        href="/product-listing"
        className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-micro"
      >
        <Icon name="ShoppingBagIcon" size={20} />
        Start Shopping
      </Link>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 mb-3 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="TruckIcon" size={24} className="text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Free Shipping
          </h3>
          <p className="text-xs text-muted-foreground">
            On orders above ₹999
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 mb-3 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="ShieldCheckIcon" size={24} className="text-success" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Secure Payment
          </h3>
          <p className="text-xs text-muted-foreground">
            100% secure transactions
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 mb-3 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon name="ArrowPathIcon" size={24} className="text-warning" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Easy Returns
          </h3>
          <p className="text-xs text-muted-foreground">
            7-day return policy
          </p>
        </div>
      </div>
    </div>
  );
}
