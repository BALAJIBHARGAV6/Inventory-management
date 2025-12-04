'use client';

export default function OrderSummary({ subtotal, shipping, tax, discount, total }) {
  return (
    <div className="bg-card rounded-md border border-border p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-text-primary">₹{subtotal?.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-text-primary">
            {shipping === 0 ? 'FREE' : `₹${shipping?.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST)</span>
          <span className="text-text-primary">₹{tax?.toLocaleString('en-IN')}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-success">-₹{discount?.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-text-primary">Total</span>
            <span className="text-xl font-bold text-text-primary">
              ₹{total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
