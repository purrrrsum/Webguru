'use client';

import { useState, useRef, useEffect } from 'react';

interface Annotation {
  id: string;
  type: 'drawing' | 'text' | 'arrow' | 'circle' | 'rectangle';
  data: any;
  color: string;
}

interface ImageAnnotationEditorProps {
  imageUrl: string;
  imageId: string;
  onSave: (annotations: Annotation[], annotatedImageDataUrl?: string) => Promise<void>;
  onClose: () => void;
}

export default function ImageAnnotationEditor({
  imageUrl,
  imageId,
  onSave,
  onClose,
}: ImageAnnotationEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'arrow' | 'circle' | 'rectangle' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [lineWidth, setLineWidth] = useState(3);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      redrawAnnotations(ctx);
    };

    image.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && imageRef.current && !isDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0);
      redrawAnnotations(ctx);
    }
  }, [annotations, isDrawing]);

  const redrawAnnotations = (ctx: CanvasRenderingContext2D) => {
    annotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = lineWidth;

      if (annotation.type === 'drawing') {
        const points = annotation.data.points;
        if (points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
      } else if (annotation.type === 'arrow') {
        const { start, end } = annotation.data;
        drawArrow(ctx, start.x, start.y, end.x, end.y);
      } else if (annotation.type === 'circle') {
        const { center, radius } = annotation.data;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (annotation.type === 'rectangle') {
        const { start, end } = annotation.data;
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (annotation.type === 'text') {
        ctx.font = '16px Arial';
        ctx.fillText(annotation.data.text, annotation.data.x, annotation.data.y);
      }
    });
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      const pos = getMousePos(e);
      setTextInput({ x: pos.x, y: pos.y, text: '' });
      return;
    }

    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (currentTool === 'pen') {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'drawing',
        data: { points: [pos] },
        color: currentColor,
      };
      setAnnotations([...annotations, newAnnotation]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    // Redraw image and all annotations
    const image = imageRef.current;
    if (image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      redrawAnnotations(ctx);
    }

    // Draw current shape
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = lineWidth;

    if (currentTool === 'pen') {
      const lastAnnotation = annotations[annotations.length - 1];
      if (lastAnnotation && lastAnnotation.type === 'drawing') {
        lastAnnotation.data.points.push(pos);
        ctx.beginPath();
        const points = lastAnnotation.data.points;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }
    } else if (currentTool === 'arrow') {
      drawArrow(ctx, startPos.x, startPos.y, pos.x, pos.y);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (currentTool === 'rectangle') {
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;

    const pos = getMousePos(e);

    if (currentTool === 'arrow') {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'arrow',
        data: { start: startPos, end: pos },
        color: currentColor,
      };
      setAnnotations([...annotations, newAnnotation]);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'circle',
        data: { center: startPos, radius },
        color: currentColor,
      };
      setAnnotations([...annotations, newAnnotation]);
    } else if (currentTool === 'rectangle') {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'rectangle',
        data: { start: startPos, end: pos },
        color: currentColor,
      };
      setAnnotations([...annotations, newAnnotation]);
    }

    setIsDrawing(false);
    setStartPos(null);
  };

  const handleTextSubmit = () => {
    if (!textInput || !textInput.text.trim()) {
      setTextInput(null);
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'text',
      data: { x: textInput.x, y: textInput.y, text: textInput.text },
      color: currentColor,
    };
    setAnnotations([...annotations, newAnnotation]);

    // Redraw
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && imageRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0);
      redrawAnnotations(ctx);
    }

    setTextInput(null);
  };

  const handleUndo = () => {
    setAnnotations(annotations.slice(0, -1));
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && imageRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0);
      redrawAnnotations(ctx);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const canvas = canvasRef.current;
      const annotatedImageDataUrl = canvas?.toDataURL('image/png');
      await onSave(annotations, annotatedImageDataUrl);
      onClose();
    } catch (error) {
      console.error('Error saving annotations:', error);
      alert('Failed to save annotations');
    } finally {
      setSaving(false);
    }
  };

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTool('pen')}
                className={`px-4 py-2 rounded ${currentTool === 'pen' ? 'bg-whatsapp-green text-white' : 'bg-gray-700 text-gray-300'}`}
                title="Pen"
              >
                ✏️ Pen
              </button>
              <button
                onClick={() => setCurrentTool('arrow')}
                className={`px-4 py-2 rounded ${currentTool === 'arrow' ? 'bg-whatsapp-green text-white' : 'bg-gray-700 text-gray-300'}`}
                title="Arrow"
              >
                ➡️ Arrow
              </button>
              <button
                onClick={() => setCurrentTool('circle')}
                className={`px-4 py-2 rounded ${currentTool === 'circle' ? 'bg-whatsapp-green text-white' : 'bg-gray-700 text-gray-300'}`}
                title="Circle"
              >
                ⭕ Circle
              </button>
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`px-4 py-2 rounded ${currentTool === 'rectangle' ? 'bg-whatsapp-green text-white' : 'bg-gray-700 text-gray-300'}`}
                title="Rectangle"
              >
                ▭ Rectangle
              </button>
              <button
                onClick={() => setCurrentTool('text')}
                className={`px-4 py-2 rounded ${currentTool === 'text' ? 'bg-whatsapp-green text-white' : 'bg-gray-700 text-gray-300'}`}
                title="Text"
              >
                📝 Text
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm">Size:</label>
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded border-2 ${currentColor === color ? 'border-white' : 'border-gray-600'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={handleUndo}
              disabled={annotations.length === 0}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded disabled:opacity-50"
            >
              ↶ Undo
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-whatsapp-green text-white rounded hover:bg-whatsapp-green-dark disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Annotation target"
              className="max-w-full max-h-[70vh] hidden"
            />
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[70vh] border border-gray-700 cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
            {textInput && (
              <div
                className="absolute bg-gray-800 border border-gray-600 rounded p-2"
                style={{
                  left: `${(textInput.x / (canvasRef.current?.width || 1)) * 100}%`,
                  top: `${(textInput.y / (canvasRef.current?.height || 1)) * 100}%`,
                }}
              >
                <input
                  type="text"
                  value={textInput.text}
                  onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                  onBlur={handleTextSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTextSubmit();
                    } else if (e.key === 'Escape') {
                      setTextInput(null);
                    }
                  }}
                  autoFocus
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                  style={{ color: currentColor }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

