import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

interface BlogPostLayoutProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  children: React.ReactNode;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ title, date, readTime, category, children }) => {
  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="glow-bg" style={{ top: '-10%', left: '-10%', width: '800px', height: '800px' }}></div>
      <div className="glow-bg" style={{ top: '20%', right: '-20%', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(178, 139, 255, 0.1) 0%, rgba(5, 5, 8, 0) 60%)' }}></div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />

        <main style={{ flex: 1, padding: '60px 0' }}>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: '720px', margin: '0 auto' }}
          >
            <a href="/blog" style={{ color: '#b066ff', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '40px' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              ← Back to Articles
            </a>

            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: 'rgba(176,102,255,0.1)',
              color: '#b066ff',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              {category}
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              {title}
            </h1>

            <div style={{
              display: 'flex',
              gap: '16px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '48px',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span>{date}</span>
              <span>·</span>
              <span>{readTime}</span>
            </div>

            <div className="blog-content" style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}>
              {children}
            </div>
          </motion.article>
        </main>

        <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>&copy; {new Date().getFullYear()} Filect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default BlogPostLayout;
