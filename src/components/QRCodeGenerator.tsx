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

// Custom TikTok SVG Icon for the UI button
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        imageSize: logoUrl === LOGOS.full ? 0.65 : 0.4,
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
        imageSize: logoUrl === LOGOS.full ? 0.65 : 0.4,
        margin: 5,
        crossOrigin: 'anonymous',
      },
      image: logoUrl || undefined
    });
  }, [url, fgColor, bgColor, dotType, cornerSquareType, cornerDotType, logoUrl]);

  const handleDownload = () => {
    if (!qrCode.current) return;
    qrCode.current.download({
      extension: 'svg',
      name: 'NaCrema-QR'
    });
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
            className="control-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
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
              className={`logo-btn ${logoUrl === LOGOS.full ? 'active' : ''}`}
              onClick={() => setLogoUrl(LOGOS.full)}
              title="Full Charcoal"
            >
              Full
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
              <TikTokIcon />
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
