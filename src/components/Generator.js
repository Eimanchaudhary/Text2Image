import React, { useState } from 'react';
import './Generator.css';

const Generator = ({ onImageGenerated, isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState({
    steps: 30,
    guidance: 8.0,
    width: 512,
    height: 512,
    seed: -1
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          ...parameters
        })
      });

      const data = await response.json();

      const imageUrl = `http://127.0.0.1:5000/generated_images/${data.filename}`;

      onImageGenerated({
        prompt,
        parameters,
        imageUrl,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });

    } catch (err) {
      console.error(err);
      alert("Error generating image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    handleParameterChange('seed', randomSeed);
  };


  const quickPresets = [
    {
      name: "High Quality",
      description: "Best results, slower generation",
      steps: 40,
      guidance: 7.0
    },
    {
      name: "Balanced",
      description: "Good quality, reasonable speed",
      steps: 30,
      guidance: 8.0
    },
    {
      name: "Fast",
      description: "Quick generation, basic quality",
      steps: 20,
      guidance: 9.0
    },
    {
      name: "Creative",
      description: "More artistic freedom",
      steps: 25,
      guidance: 12.0
    }
  ];

  const applyPreset = (preset) => {
    setParameters(prev => ({
      ...prev,
      steps: preset.steps,
      guidance: preset.guidance
    }));
  };

  return (
    <section className="generator-section">
      <div className="generator-container">
        <div className="input-group">
          <label className="input-label">Describe your vision</label>
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city at sunset with flying cars, cyberpunk style, neon lights, detailed architecture..."
            rows="3"
          />
          <div className="character-count">
            {prompt.length}/1000 characters
          </div>
        </div>

        
        <div className="presets-section">
          <label className="presets-label">Quick Presets</label>
          <div className="presets-grid">
            {quickPresets.map((preset, index) => (
              <button
                key={index}
                className={`preset-btn ${parameters.steps === preset.steps && parameters.guidance === preset.guidance ? 'active' : ''}`}
                onClick={() => applyPreset(preset)}
                type="button"
              >
                <span className="preset-name">{preset.name}</span>
                <span className="preset-desc">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="parameters-grid">
          <div className="parameter-group">
            <label className="parameter-label">
              Steps: {parameters.steps}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={parameters.steps}
              onChange={(e) => handleParameterChange('steps', parseInt(e.target.value))}
              className="parameter-slider"
            />
            <div className="parameter-hint">More steps = better quality, slower generation</div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">
              Guidance Scale: {parameters.guidance}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={parameters.guidance}
              onChange={(e) => handleParameterChange('guidance', parseFloat(e.target.value))}
              className="parameter-slider"
            />
            <div className="parameter-hint">How closely to follow the prompt</div>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Width</label>
            <select
              value={parameters.width}
              onChange={(e) => handleParameterChange('width', parseInt(e.target.value))}
              className="parameter-select"
            >
              <option value={256}>256px</option>
              <option value={512}>512px</option>
              <option value={768}>768px</option>
            </select>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">Height</label>
            <select
              value={parameters.height}
              onChange={(e) => handleParameterChange('height', parseInt(e.target.value))}
              className="parameter-select"
            >
              <option value={256}>256px</option>
              <option value={512}>512px</option>
              <option value={768}>768px</option>
            </select>
          </div>

          <div className="parameter-group">
            <label className="parameter-label">
              Seed: {parameters.seed === -1 ? 'Random' : parameters.seed}
            </label>
            <div className="seed-controls">
              <input
                type="number"
                value={parameters.seed === -1 ? '' : parameters.seed}
                onChange={(e) => handleParameterChange('seed', e.target.value ? parseInt(e.target.value) : -1)}
                className="seed-input"
                placeholder="Random"
              />
              <button 
                className="random-seed-btn"
                onClick={handleRandomSeed}
                type="button"
              >
                🎲
              </button>
            </div>
            <div className="parameter-hint">Same seed = same image</div>
          </div>
        </div>

        <button 
          className={`generate-button ${isLoading ? 'loading' : ''}`}
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Generating Your Image...
            </>
          ) : (
            <>
              <span className="button-icon"></span>
              Generate Image
            </>
          )}
        </button>

        <div className="tips-section">
          <h4>Prompt Tips</h4>
          <ul>
            <li>Be specific about style, colors, and composition</li>
            <li>Include details like lighting, mood, and perspective</li>
            <li>Use artists' names for specific styles (e.g., "by Van Gogh")</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Generator;