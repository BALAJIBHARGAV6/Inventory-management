'use client';

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-smooth">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name="StarIcon"
            size={18}
            variant={index < (testimonial?.rating || 5) ? 'solid' : 'outline'}
            className={index < (testimonial?.rating || 5) ? 'text-warning' : 'text-muted-foreground'}
          />
        ))}
      </div>

      <p className="text-text-secondary mb-6 leading-relaxed">
        &quot;{testimonial?.content}&quot;
      </p>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
          <AppImage
            src={testimonial?.avatar}
            alt={testimonial?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary">
            {testimonial?.name}
          </h4>
          {testimonial?.location && (
            <p className="text-xs text-muted-foreground">
              {testimonial?.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
