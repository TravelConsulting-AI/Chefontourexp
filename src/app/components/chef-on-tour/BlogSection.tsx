import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Secret to Perfect Pasta: Lessons from Italian Grandmothers',
    excerpt: 'Discover the time-honored techniques that make authentic Italian pasta truly unforgettable, from selecting the right flour to achieving that perfect al dente texture.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    category: 'Cooking Tips',
    date: 'December 15, 2024',
    readTime: '5 min read',
    author: 'Chef Charles Webb'
  },
  {
    id: 2,
    title: 'Tokyo\'s Hidden Culinary Gems: Beyond the Tourist Trail',
    excerpt: 'Join us as we explore the intimate izakayas and family-run establishments that Tokyo locals have cherished for generations.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop',
    category: 'Travel',
    date: 'December 10, 2024',
    readTime: '7 min read',
    author: 'Chef Charles Webb'
  },
  {
    id: 3,
    title: 'The Art of Wine Pairing: A Tuscan Perspective',
    excerpt: 'Learn how to pair wines like an Italian sommelier with insights from our recent tour through Tuscany\'s renowned wine country.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    category: 'Wine & Spirits',
    date: 'December 5, 2024',
    readTime: '6 min read',
    author: 'Chef Charles Webb'
  }
];

export function BlogSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#F8F6F3] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">From Our Kitchen</h2>
          <p className="text-xl text-gray-600">
            Stories, recipes, and insights from around the world
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className="absolute left-4 top-4 rounded-full bg-[#D4A574] px-4 py-1 text-sm text-white">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl transition-colors group-hover:text-[#D4A574]">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-4 text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <motion.div
                  className="flex items-center gap-2 text-[#D4A574]"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-semibold">Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            className="rounded-full border-2 border-[#D4A574] bg-transparent px-12 py-4 text-[#D4A574] transition-all hover:bg-[#D4A574] hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Posts
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
