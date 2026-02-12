import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { Instagram, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

export function FollowSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  // Load LightWidget script
  useEffect(() => {
    // Check if script is already loaded
    if (!document.getElementById('lightwidget-script')) {
      const script = document.createElement('script');
      script.id = 'lightwidget-script';
      script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section ref={ref} className="relative bg-[#F4F1EA] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl italic text-[#1a1a1a]">
            Follow us on
          </h2>
          <a
            href="https://instagram.com/chefcharleswebb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-base sm:text-lg text-[#1a1a1a] hover:text-[#D4A574] transition-colors"
          >
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
            @chefcharleswebb
          </a>
        </motion.div>

        {/* LightWidget Instagram Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lightwidget-container"
        >
          {/* 
            SETUP INSTRUCTIONS:
            1. Go to https://lightwidget.com/
            2. Enter Instagram username: chefcharleswebb
            3. Customize the widget:
               - Layout: Grid
               - Number of photos: 12
               - Number of rows: 2
               - Responsive: Yes
            4. Copy the generated iframe code
            5. Replace the iframe below with your custom widget code
            
            The current iframe is a placeholder. You'll get a unique widget ID from LightWidget.
          */}
          <iframe
            src="https://cdn.lightwidget.com/widgets/YOUR_WIDGET_ID.html"
            scrolling="no"
            allowtransparency="true"
            className="lightwidget-widget w-full border-0"
            style={{ 
              width: '100%', 
              border: 0, 
              overflow: 'hidden',
              minHeight: '400px'
            }}
            title="Instagram Feed by LightWidget"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <a
            href="https://instagram.com/chefcharleswebb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
          >
            <Instagram className="h-4 w-4" />
            View Full Feed on Instagram
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <details className="max-w-3xl mx-auto">
            <summary className="font-sans text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              🔧 LightWidget Setup Instructions (Click to expand)
            </summary>
            <div className="mt-4 p-4 bg-white/50 rounded-lg text-left">
              <p className="font-sans text-xs text-gray-600 mb-2">
                <strong>How to activate your Instagram feed with LightWidget:</strong>
              </p>
              <ol className="font-sans text-xs text-gray-600 ml-4 list-decimal space-y-2">
                <li>
                  Visit <a href="https://lightwidget.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">lightwidget.com</a>
                </li>
                <li>
                  Enter your Instagram username: <code className="bg-gray-200 px-1 rounded">chefcharleswebb</code>
                </li>
                <li>
                  Customize your widget settings:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Layout:</strong> Grid (recommended for this design)</li>
                    <li><strong>Number of photos:</strong> 12 (displays beautifully as 6×2 on desktop)</li>
                    <li><strong>Number of rows:</strong> 2</li>
                    <li><strong>Responsive:</strong> Yes (auto-adjusts to 4×3 tablet, 2×6 mobile)</li>
                    <li><strong>Spacing:</strong> Small (matches current design)</li>
                  </ul>
                </li>
                <li>
                  Click "Get Widget" to generate your custom embed code
                </li>
                <li>
                  Copy the generated <code className="bg-gray-200 px-1 rounded">&lt;iframe&gt;</code> code
                </li>
                <li>
                  Replace the placeholder iframe in <code className="bg-gray-200 px-1 rounded">/src/app/components/chef-on-tour/FollowSection.tsx</code> (around line 74)
                </li>
                <li>
                  Update <code className="bg-gray-200 px-1 rounded">YOUR_WIDGET_ID</code> with your unique widget ID from LightWidget
                </li>
              </ol>
              <p className="font-sans text-xs text-gray-600 mt-3">
                <strong>Pricing:</strong> LightWidget offers a free plan with basic features. Premium plans start at $10/month for additional customization and no branding.
              </p>
              <p className="font-sans text-xs text-gray-600 mt-2">
                <strong>Note:</strong> The widget is fully responsive and will automatically adjust to different screen sizes while maintaining the elegant design of your site.
              </p>
            </div>
          </details>
        </motion.div>
      </div>

      {/* Custom Styling for LightWidget Integration */}
      <style dangerouslySetInnerHTML={{__html: `
        .lightwidget-container {
          max-width: 100%;
          margin: 0 auto;
        }
        
        /* Ensure LightWidget iframe is responsive */
        .lightwidget-widget {
          display: block;
          width: 100% !important;
        }
        
        /* Override LightWidget default spacing if needed */
        .lightwidget-container iframe {
          background: transparent;
        }
      `}} />
    </section>
  );
}