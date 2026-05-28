'use client';

import { useEffect, useRef, useState } from 'react';

type SignaturePadInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SignaturePadInput({ value, onChange }: SignaturePadInputProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2;
    context.strokeStyle = '#111827';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const point = getPoint(event);
    if (!canvas || !context || !point) return;

    context.beginPath();
    context.moveTo(point.x, point.y);
    setIsDrawing(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const point = getPoint(event);
    if (!canvas || !context || !point) return;

    context.lineTo(point.x, point.y);
    context.stroke();
    onChange(canvas.toDataURL('image/png'));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <canvas
        ref={canvasRef}
        width={640}
        height={220}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        style={{ width: '100%', maxWidth: '100%', touchAction: 'none', border: '1px solid #d1d5db', borderRadius: 12, background: '#fff' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: 14 }}>{value ? 'Signature captured.' : 'Please sign in the box above.'}</span>
        <button type="button" onClick={clearSignature} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>
          Clear Signature
        </button>
      </div>
    </div>
  );
}
