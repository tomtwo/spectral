import React, { useRef, useState, useEffect, useCallback } from 'react';
import Spectrogram from 'spectrogram';
import chroma from 'chroma-js';

import './SpectralCanvas.css';

export default function SpectralCanvas({ arraybuf }) {
  const canvasRef = useRef(null);
  const [latency, setLatency] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const spectroRef = useRef(null);

  useEffect(() => {
    if (!arraybuf) {
      return;
    }

    let spectro = Spectrogram(canvasRef.current, {
      canvas: {
        // width: function() {
        //   return window.innerWidth;
        // },
        height: 500,
      },
      audio: {
        enable: true,
      },
      colors: function(steps) {
        var baseColors = [
          [0, 0, 255, 1],
          [0, 255, 255, 1],
          [0, 255, 0, 1],
          [255, 255, 0, 1],
          [255, 0, 0, 1],
        ];
        var positions = [0, 0.15, 0.3, 0.5, 0.75];

        var scale = new chroma.scale(baseColors, positions).domain([0, steps]);

        var colors = [];

        for (var i = 0; i < steps; ++i) {
          var color = scale(i);
          colors.push(color.hex());
        }

        return colors;
      },
    });
    spectroRef.current = spectro;

    let audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    audioContext.decodeAudioData(arraybuf, function(buffer) {
      spectro.connectSource(buffer, audioContext);
      spectro.start();
      setIsPlaying(true);

      // spectro._sources.audioBufferStream.sourceNode.playbackRate.value = 15;
    });

    let metadataTimer = setInterval(() => {
      setLatency(audioContext.baseLatency);
      setCurrentTime(audioContext.currentTime);
    }, 50);

    return () => {
      clearInterval(metadataTimer);

      spectro.stop();
      setIsPlaying(false);
      audioContext.close();

      spectro = null;
      spectroRef.current = null;
      audioContext = null;
      audioContextRef.current = null;
    };
  }, []);

  useEffect(() => {
    window._spectro = spectroRef.current;
  }, [spectroRef.current]);

  const onTogglePlayState = useCallback(() => {
    const audioContext = audioContextRef.current;

    if (audioContext) {
      if (audioContext.state === 'running') {
        audioContext.suspend();
        setIsPlaying(false);
      } else {
        audioContext.resume();
        setIsPlaying(true);
      }
    }

    // const spectro = spectroRef.current;

    // console.log('got spec', spectro);

    // if (spectro) {
    //   if (spectro._paused) {
    //     spectro.pause();
    //     setIsPlaying(false);
    //   } else {
    //     spectro.resume();
    //     setIsPlaying(true);
    //   }
    // }
  }, [audioContextRef, spectroRef]);

  return (
    <div className="app-SpectralCanvas">
      <canvas ref={canvasRef} onClick={onTogglePlayState} />
      <p>Latency: {(latency * 1000).toFixed(1)}ms</p>
      <p>Current time: {(currentTime || 0).toFixed(0)}s</p>
      <p>State: {isPlaying ? 'playing' : 'paused'}</p>
    </div>
  );
}
