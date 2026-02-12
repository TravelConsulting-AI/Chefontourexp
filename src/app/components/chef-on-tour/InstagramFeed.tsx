import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    likes: 1234,
    comments: 56
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    likes: 2100,
    comments: 89
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
    likes: 1876,
    comments: 67
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
    likes: 1543,
    comments: 42
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    likes: 1987,
    comments: 73
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1481931715705-36f5f79f1f3d?w=400&h=400&fit=crop',
    likes: 2345,
    comments: 91
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    likes: 1654,
    comments: 48
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
    likes: 1876,
    comments: 55
  }
];

export function InstagramFeed() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Instagram className="h-8 w-8 text-[#D4A574]" />
            <h2 className="text-5xl">Follow Our Journey</h2>
          </div>
          <p className="mb-6 text-xl text-gray-600">
            Join us on Instagram @chefontour for daily culinary inspiration
          </p>
          <motion.a
            href="https://instagram.com/chefontour"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white transition-all hover:from-purple-700 hover:to-pink-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="h-5 w-5" />
            Follow Us
          </motion.a>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            >
              <ImageWithFallback
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="h-6 w-6" />
                  <span className="font-semibold">{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MessageCircle className="h-6 w-6" />
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>

              {/* Instagram gradient border effect on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 ring-4 ring-gradient-to-r ring-from-purple-600 ring-to-pink-600 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
