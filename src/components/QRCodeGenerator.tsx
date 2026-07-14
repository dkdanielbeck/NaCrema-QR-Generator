import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type {
  DotType,
  CornerSquareType,
  CornerDotType
} from 'qr-code-styling';
import { motion } from 'framer-motion';
import { Download, Palette, Link, Image as ImageIcon } from 'lucide-react';
import { LOGOS } from '../utils/logos';
import './QRCodeGenerator.css';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const QRCodeGenerator: React.FC = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // State
  const [url, setUrl] = useState<string>('https://nacrema.dk');
  const [fgColor, setFgColor] = useState<string>('#2C2C2C');
  const [bgColor, setBgColor] = useState<string>('#F9F8F6');
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot');
  const [logoUrl, setLogoUrl] = useState<string>(LOGOS.star);

  // Initialize QR Code on mount
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 320,
      height: 320,
      data: url,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: fgColor,
        type: dotType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerSquareType
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerDotType
      },
      image: logoUrl || undefined
    });

    if (qrRef.current) {
      qrCode.current.append(qrRef.current);
    }
  }, []); // Only on mount

  // Update QR Code on state change
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        color: fgColor,
        type: dotType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerSquareType
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerDotType
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: 'anonymous',
      },
      image: logoUrl || undefined
    });
  }, [url, fgColor, bgColor, dotType, cornerSquareType, cornerDotType, logoUrl]);

  const handleDownload = async () => {
    if (!qrCode.current) return;

    const blob = await qrCode.current.getRawData('svg');
    if (!blob) return;

    let svgText = await blob.text();

    if (logoUrl) {
      // Decode the base64 SVG logo to inline it (Figma drops <image> tags)
      const base64Data = logoUrl.split(',')[1];
      if (base64Data) {
        const decodedSvg = atob(base64Data);

        // Find the <image> tag in the generated SVG
        const imageRegex = /<image([^>]*)>(.*?)<\/image>|<image([^>]*)\/>/gi;

        svgText = svgText.replace(imageRegex, (_match: string, attrs1: string, _content: string, attrs2: string) => {
          const attrs = attrs1 || attrs2 || '';

          // Extract x, y, width, height from the original <image> tag
          const xMatch = attrs.match(/x="([^"]*)"/);
          const yMatch = attrs.match(/y="([^"]*)"/);
          const wMatch = attrs.match(/width="([^"]*)"/);
          const hMatch = attrs.match(/height="([^"]*)"/);

          const x = xMatch ? xMatch[1] : '0';
          const y = yMatch ? yMatch[1] : '0';
          const width = wMatch ? wMatch[1] : '0';
          const height = hMatch ? hMatch[1] : '0';

          // Inline the decoded SVG by removing its existing x,y,width,height and applying the bounding box
          return decodedSvg.replace(/<svg([^>]*)>/i, (_svgMatch, svgAttrs) => {
            const newAttrs = svgAttrs.replace(/\s+(x|y|width|height)="[^"]*"/gi, '');
            return `<svg x="${x}" y="${y}" width="${width}" height="${height}"${newAttrs}>`;
          });
        });
      }
    }

    // Generate descriptive filename
    let domain = 'QR';
    try {
      // Use URL constructor to easily extract the hostname
      const parsedUrl = new URL(url);
      domain = parsedUrl.hostname.replace(/^www\./, '');
    } catch (e) {
      // Fallback if URL is incomplete
      domain = url.replace(/[^a-zA-Z0-9.-]/g, '').substring(0, 20) || 'QR';
    }

    let logoName = 'no-logo';
    if (logoUrl === LOGOS.star) logoName = 'star';
    else if (logoUrl === LOGOS.instagram) logoName = 'instagram';
    else if (logoUrl === LOGOS.facebook) logoName = 'facebook';
    else if (logoUrl === LOGOS.tiktok) logoName = 'tiktok';

    const filename = `nacrema-${domain}-${logoName}.svg`;

    const modifiedBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const urlBlob = URL.createObjectURL(modifiedBlob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="qr-generator-container">
      {/* Left Column: Controls */}
      <div className="qr-controls">
        <div className="qr-header">
          <h1>Na Crema</h1>
          <p>QR-kode Generator</p>
        </div>

        <div className="control-section">
          <label className="control-label">
            <Link size={18} />
            Indtast URL
          </label>
          <input
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://nacrema.dk"
          />
          <div className="quick-links">
            <button
              className="quick-link-btn"
              onClick={() => {
                setUrl('https://www.instagram.com/nacremadk/');
                setLogoUrl(LOGOS.instagram);
              }}
              title="Vælg Instagram"
            >
              <img src={LOGOS.instagram} alt="" className="quick-link-icon" /> Instagram
            </button>
            <button
              className="quick-link-btn"
              onClick={() => {
                setUrl('https://www.tiktok.com/@nacremadk');
                setLogoUrl(LOGOS.tiktok);
              }}
              title="Vælg TikTok"
            >
              <TikTokIcon className="quick-link-icon svg-icon" /> TikTok
            </button>
            <button
              className="quick-link-btn"
              onClick={() => {
                setUrl('https://www.facebook.com/people/Na-Crema/61559169265299');
                setLogoUrl(LOGOS.facebook);
              }}
              title="Vælg Facebook"
            >
              <img src={LOGOS.facebook} alt="" className="quick-link-icon" /> Facebook
            </button>
          </div>
        </div>

        <div className="control-section">
          <label className="control-label">
            <Palette size={18} />
            Tilpas Design
          </label>

          <div className="control-group">
            <label className="sub-label">Mønster Stil</label>
            <select
              className="control-select"
              value={dotType}
              onChange={(e) => setDotType(e.target.value as DotType)}
            >
              <option value="rounded">Afrundet (Anbefalet)</option>
              <option value="dots">Prikker</option>
              <option value="classy">Klassisk</option>
              <option value="classy-rounded">Klassisk Afrundet</option>
              <option value="square">Firkantet</option>
              <option value="extra-rounded">Ekstra Afrundet</option>
            </select>
          </div>

          <div className="control-group row">
            <div className="half-width">
              <label className="sub-label">Ydre Øje</label>
              <select
                className="control-select"
                value={cornerSquareType}
                onChange={(e) => setCornerSquareType(e.target.value as CornerSquareType)}
              >
                <option value="extra-rounded">Afrundet</option>
                <option value="square">Firkantet</option>
                <option value="dot">Prik</option>
              </select>
            </div>
            <div className="half-width">
              <label className="sub-label">Indre Øje</label>
              <select
                className="control-select"
                value={cornerDotType}
                onChange={(e) => setCornerDotType(e.target.value as CornerDotType)}
              >
                <option value="dot">Prik</option>
                <option value="square">Firkantet</option>
              </select>
            </div>
          </div>

          <div className="control-group row">
            <div className="half-width">
              <label className="sub-label">QR Farve</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="color-picker"
                />
                <span className="color-hex">{fgColor}</span>
              </div>
            </div>
            <div className="half-width">
              <label className="sub-label">Baggrund</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="color-picker"
                />
                <span className="color-hex">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="control-section">
          <label className="control-label">
            <ImageIcon size={18} />
            Logo i Midten
          </label>
          <div className="logo-buttons">
            <button
              className={`logo-btn ${logoUrl === LOGOS.star ? 'active' : ''}`}
              onClick={() => setLogoUrl(LOGOS.star)}
              title="Star Charcoal"
            >
              Star
            </button>
            <button
              className={`logo-btn ${logoUrl === LOGOS.instagram ? 'active' : ''}`}
              onClick={() => setLogoUrl(LOGOS.instagram)}
              title="Instagram"
            >
              <img src={LOGOS.instagram} alt="Instagram" width="18" height="18" className="btn-icon-img" />
            </button>
            <button
              className={`logo-btn ${logoUrl === LOGOS.facebook ? 'active' : ''}`}
              onClick={() => setLogoUrl(LOGOS.facebook)}
              title="Facebook"
            >
              <img src={LOGOS.facebook} alt="Facebook" width="18" height="18" className="btn-icon-img" />
            </button>
            <button
              className={`logo-btn ${logoUrl === LOGOS.tiktok ? 'active' : ''}`}
              onClick={() => setLogoUrl(LOGOS.tiktok)}
              title="TikTok"
            >
              <TikTokIcon className="btn-icon-img" />
            </button>
            <button
              className={`logo-btn text-btn ${logoUrl === '' ? 'active' : ''}`}
              onClick={() => setLogoUrl('')}
            >
              Intet
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <motion.div
        className="qr-preview-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Serene easing
      >
        <div className="qr-preview-card">
          <div className="qr-preview-box" ref={qrRef} />

          <button className="download-btn" onClick={handleDownload}>
            <Download size={20} />
            Download som SVG
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QRCodeGenerator;
