import { useState, useEffect, useRef } from "react";
import { galleryAPI } from "../../utils/api.js";

// Fallback images if API fails
const fallbackImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    category: "Health Camp",
    title: "Medical Checkup Drive",
    location: "Uttar Pradesh",
    date: "2025",
    span: "wide",
  },
];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState(fallbackImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef({});

  // Fetch gallery images from admin panel
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await galleryAPI.getAll("true"); // Only fetch active images
        if (response.success && response.data) {
          // Backend returns { success: true, data: { images: [...] } }
          const activeImages = (response.data.images || []).filter(
            (img) => img.isActive !== false
          );
          if (activeImages.length > 0) {
            // Transform API data to match component format
            const transformed = activeImages.map((img, index) => ({
              id: img._id || img.id || index + 1,
              src: img.imageUrl,
              category: "Gallery", // Default category since model doesn't have this field
              title: img.title || img.imageName || `Image ${index + 1}`,
              location: "", // Location not in model
              date: img.createdAt
                ? new Date(img.createdAt).getFullYear().toString()
                : new Date().getFullYear().toString(),
              span: getSpanForIndex(index), // Alternate span types for visual variety
            }));
            setGalleryImages(transformed);
          } else {
            // Fallback to default images if no active images
            setGalleryImages(fallbackImages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
        // Fallback to default images on error
        setGalleryImages(fallbackImages);
      } finally {
        setLoading(false);
        setTimeout(() => setLoaded(true), 80);
      }
    };

    fetchGalleryImages();
  }, []);

  // Helper function to assign span types for visual variety
  const getSpanForIndex = (index) => {
    const patterns = ["normal", "normal", "wide", "normal", "tall", "normal", "wide", "normal"];
    return patterns[index % patterns.length];
  };

  useEffect(() => {
    if (!loading && galleryImages.length > 0) {
      // Reset observer when images change
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting)
              setVisibleCards((p) => new Set([...p, e.target.dataset.id]));
          }),
        { threshold: 0.08 },
      );
      Object.values(cardRefs.current).forEach((r) => r && observer.observe(r));
      return () => observer.disconnect();
    }
  }, [galleryImages, loading]);

  return (
    <div
      style={{
        fontFamily: "'Mukta', sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2e8b00; --green-dark: #1e6000; --red: #c0392b; --red-dark: #96281b; --text: #1a1a1a; --text-muted: #555; }

        .gallery-wrap { padding: 24px 100px 48px; max-width: 1400px; margin: 0 auto; }
        @media (max-width: 768px) {
          .gallery-wrap { padding: 16px 12px 28px; }
        }
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

        .card { position: relative; overflow: hidden; border-radius: 4px; cursor: pointer; background: #ddd; aspect-ratio: 4/3; border: 2px solid transparent; opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.25s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .card.col-2 { grid-column: span 2; }
        .card.row-2 { grid-row: span 2; aspect-ratio: auto; }
        .card.visible { opacity: 1; transform: translateY(0); }
        .card:hover { border-color: var(--green); box-shadow: 0 6px 24px rgba(46,139,0,0.2); z-index: 2; }
        .card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover img { transform: scale(1.06); }

        .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,60,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%); opacity: 0; transition: opacity 0.3s ease; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; }
        .card:hover .card-overlay { opacity: 1; }
        .card-badge { display: inline-block; padding: 3px 10px; background: var(--green); color: #fff; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; margin-bottom: 6px; width: fit-content; }
        .card-title { font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 3px; }
        .card-loc { font-size: 0.65rem; color: rgba(255,255,255,0.7); }
        .card-num { position: absolute; top: 8px; right: 10px; background: rgba(0,0,0,0.45); color: #fff; font-size: 0.6rem; font-weight: 700; padding: 2px 7px; border-radius: 2px; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--green); z-index: 1; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
        .card:hover::before { transform: scaleX(1); }

        .lightbox { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.88); display: flex; align-items: center; justify-content: center; padding: 24px; animation: lbIn 0.25s ease; }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-box { background: #fff; border-radius: 6px; overflow: hidden; max-width: 860px; width: 100%; box-shadow: 0 24px 80px rgba(0,0,0,0.5); animation: lbUp 0.3s ease; }
        @keyframes lbUp { from { transform: translateY(30px); opacity:0; } to { transform: translateY(0); opacity:1; } }
        .lightbox-img { width: 100%; max-height: 60vh; object-fit: contain; display: block; background: #111; }
        .lightbox-info { padding: 18px 24px; border-top: 3px solid var(--green); display: flex; justify-content: space-between; align-items: center; }
        .lb-badge { background: var(--green); color: #fff; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; display: inline-block; margin-bottom: 6px; }
        .lb-title { font-size: 1.15rem; font-weight: 700; color: var(--text); }
        .lb-meta { font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; }
        .lb-close { background: var(--red); color: #fff; border: none; width: 36px; height: 36px; border-radius: 3px; font-size: 1rem; cursor: pointer; font-weight: 700; transition: background 0.2s; flex-shrink: 0; }
        .lb-close:hover { background: var(--red-dark); }

        .page-wrap { opacity: 0; transition: opacity 0.6s ease; }
        .page-wrap.loaded { opacity: 1; }

        @media(max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2,1fr); }
          .card.col-2 { grid-column: span 2; }
        }
      `}</style>

      <div className={`page-wrap ${loaded ? "loaded" : ""}`}>
        <div className="gallery-wrap">
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#666" }}>
              Loading gallery images...
            </div>
          ) : galleryImages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#666" }}>
              No gallery images available.
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((img, idx) => (
              <div
                key={img.id}
                ref={(el) => {
                  cardRefs.current[img.id] = el;
                }}
                data-id={img.id}
                className={`card ${img.span === "wide" ? "col-2" : ""} ${img.span === "tall" ? "row-2" : ""} ${visibleCards.has(String(img.id)) ? "visible" : ""}`}
                style={{ transitionDelay: `${(idx % 8) * 0.06}s` }}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.src} alt={img.title} loading="lazy" />
                <div className="card-num">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="card-overlay">
                  <div className="card-badge">{img.category}</div>
                  <div className="card-title">{img.title}</div>
                  <div className="card-loc">
                    📍 {img.location} · {img.date}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {!loading && galleryImages.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Showing {galleryImages.length} image{galleryImages.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <img
              className="lightbox-img"
              src={selectedImage.src}
              alt={selectedImage.title}
            />
            <div className="lightbox-info">
              <div>
                {selectedImage.category && (
                  <div className="lb-badge">{selectedImage.category}</div>
                )}
                <div className="lb-title">{selectedImage.title}</div>
                {selectedImage.location && (
                  <div className="lb-meta">
                    📍 {selectedImage.location} &nbsp;·&nbsp; {selectedImage.date}
                  </div>
                )}
                {!selectedImage.location && selectedImage.date && (
                  <div className="lb-meta">{selectedImage.date}</div>
                )}
              </div>
              <button
                className="lb-close"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
