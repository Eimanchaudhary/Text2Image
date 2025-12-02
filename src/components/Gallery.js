import React from 'react';
import './Gallery.css';

const Gallery = ({ images }) => {
  const handleDownload = (imageUrl, prompt) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `prompt2pixel-${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="empty-gallery">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
            </div>
            <h3>Your Gallery is Empty</h3>
            <p>Generate your first image to see it here!</p>
            <div className="empty-illustration">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">
          Your Generated Images
          <span className="image-count">({images.length})</span>
        </h2>
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <div className="image-container">
                <img 
                  src={image.imageUrl} 
                  alt={image.prompt}
                  className="generated-image"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(image.imageUrl, image.prompt)}
                  >
                    <span className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </span>
                    Download
                  </button>
                </div>
                <div className="generation-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {Math.round((Date.now() - new Date(image.timestamp).getTime()) / 60000)}m ago
                </div>
              </div>
              <div className="image-info">
                <p className="image-prompt" title={image.prompt}>
                  {image.prompt}
                </p>
                <div className="image-meta">
                  <span className="meta-item">
                    <span className="meta-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </span>
                    {image.parameters.steps} steps
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </span>
                    {image.parameters.guidance}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      </svg>
                    </span>
                    {image.parameters.width}x{image.parameters.height}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;