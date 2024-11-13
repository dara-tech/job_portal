import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SmartCropAndScale = ({ src, width, height, alt }) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
  }, [src]);

  const handleOffsetXChange = (e) => {
    setCropOffset({ ...cropOffset, x: parseFloat(e.target.value) });
  };

  const handleOffsetYChange = (e) => {
    setCropOffset({ ...cropOffset, y: parseFloat(e.target.value) });
  };

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  return (
    <div>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            objectPosition: `${cropOffset.x}% ${cropOffset.y}%`,
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <div>
        <label>
          Horizontal position:
          <input
            type="range"
            min="0"
            max="100"
            value={cropOffset.x}
            onChange={handleOffsetXChange}
          />
        </label>
      </div>
      <div>
        <label>
          Vertical position:
          <input
            type="range"
            min="0"
            max="100"
            value={cropOffset.y}
            onChange={handleOffsetYChange}
          />
        </label>
      </div>
      <div>
        <label>
          Scale:
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleScaleChange}
          />
        </label>
      </div>
    </div>
  );
};

SmartCropAndScale.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
};

export default SmartCropAndScale;
