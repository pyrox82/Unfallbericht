"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Section } from "./FormField";
import { t, type Sprache } from "@/lib/i18n";

interface Props {
  lang: Sprache;
  value: string;
  onChange: (dataUrl: string) => void;
}

export function SkizzeCanvas({ lang, value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#1e40af");
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
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

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
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
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
    },
    [isDrawing, color, lineWidth, tool]
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
    <Section title={t("sectionSkizze", lang)}>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tool === "pen" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("btnStift", lang)}
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tool === "eraser" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("btnRadierer", lang)}
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title={t("titleFarbe", lang)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
        />
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={1}>{t("strichDuenn", lang)}</option>
          <option value={2}>{t("strichNormal", lang)}</option>
          <option value={4}>{t("strichDick", lang)}</option>
          <option value={8}>{t("strichSehrDick", lang)}</option>
        </select>
        <button
          onClick={clear}
          className="px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
        >
          {t("btnAllesLoeschen", lang)}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full border border-gray-300 rounded-lg touch-none bg-white cursor-crosshair"
        style={{ touchAction: "none" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <p className="text-xs text-gray-400 mt-1">
        {t("hintSkizze", lang)}
      </p>
    </Section>
  );
}
