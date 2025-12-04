'use client';

export default function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  return (
    <article className="group relative">
      {/* Decorative Quote Mark */}
      <div className="mb-8">
        <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors duration-500">
          <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>

      {/* Testimonial Content */}
      <blockquote className="mb-12">
        <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-700 dark:text-neutral-300 italic">
          "{testimonial?.content}"
        </p>
      </blockquote>

      {/* Author Section */}
      <footer className="relative">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div 
              className="w-14 h-14 rounded-full bg-cover bg-center bg-neutral-200 dark:bg-neutral-700 ring-2 ring-neutral-100 dark:ring-neutral-800"
              style={{ backgroundImage: `url(${testimonial?.avatar})` }}
            />
          </div>
          <div className="min-w-0">
            <cite className="not-italic block">
              <div className="text-base font-medium text-neutral-900 dark:text-white tracking-wide">
                {testimonial?.name}
              </div>
              {testimonial?.location && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
                  {testimonial?.location}
                </div>
              )}
            </cite>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="absolute -bottom-6 left-0 right-0">
          <div className="h-px bg-gradient-to-r from-neutral-200 dark:from-neutral-800 via-neutral-300 dark:via-neutral-700 to-neutral-200 dark:to-neutral-800 group-hover:from-neutral-300 dark:group-hover:from-neutral-600 group-hover:via-neutral-900 dark:group-hover:via-white group-hover:to-neutral-300 dark:group-hover:to-neutral-600 transition-all duration-700"></div>
        </div>
      </footer>
    </article>
  );
}
