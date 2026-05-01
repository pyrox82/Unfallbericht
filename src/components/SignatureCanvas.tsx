"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Section } from "./FormField";

interface Props {
  unterschriftA: string;
  unterschriftB: string;
  onChangeA: (dataUrl: string) => void;
  onChangeB: (dataUrl: string) => void;
}

function SignaturePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = (e: React.PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastPos.current?.x ?? pos.x, lastPos.current?.y ?? pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
    },
    [isDrawing]
  );

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <button
          onClick={clear}
          className="px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Löschen
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full border border-gray-300 rounded-lg touch-none bg-white cursor-crosshair"
        style={{ touchAction: "none" }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={stopDraw}
        onPointerLeave={stopDraw}
        onPointerCancel={stopDraw}
      />
      <p className="text-xs text-gray-400">
        Mit Stift, Finger oder Maus unterschreiben
      </p>
    </div>
  );
}

export function SignatureCanvas({
  unterschriftA,
  unterschriftB,
  onChangeA,
  onChangeB,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Unterschriften">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad
            label="Fahrzeug A – Unterschrift"
            value={unterschriftA}
            onChange={onChangeA}
          />
          <SignaturePad
            label="Fahrzeug B – Unterschrift"
            value={unterschriftB}
            onChange={onChangeB}
          />
        </div>
      </Section>
    </div>
  );
}
