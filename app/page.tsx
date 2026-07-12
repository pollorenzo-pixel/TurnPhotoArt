"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InfoSections } from "@/components/info-sections";
import { ProgressState } from "@/components/progress-state";
import { ResultPreview } from "@/components/result-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UploadStudio } from "@/components/upload-studio";
import { PREVIEW_CONFIG, PRODUCT, validatePhotoFile } from "@/lib/turn-photo-art";

type SelectedPhoto = { file: File; url: string };

export default function HomePage() {
  const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [split, setSplit] = useState(52);
  const photoRef = useRef<SelectedPhoto | null>(null);

  useEffect(() => { photoRef.current = photo; }, [photo]);
  useEffect(() => () => { if (photoRef.current) URL.revokeObjectURL(photoRef.current.url); }, []);

  const clearPhoto = useCallback(() => {
    setPhoto((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setError("");
    setShowResult(false);
    setSplit(52);
  }, []);

  const acceptFile = useCallback((file: File) => {
    setError("");
    setShowResult(false);
    const validationError = validatePhotoFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setPhoto((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { file, url };
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("We couldn’t read that image. Please try another photo.");
    };
    image.src = url;
  }, []);

  const generate = useCallback(() => {
    if (!photo) {
      setError("Add a photo first, then we can make it playful.");
      document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setError("");
    setShowResult(false);
    setIsProcessing(true);
    setProgressIndex(0);
    const progressTimer = window.setInterval(() => setProgressIndex((value) => Math.min(value + 1, 2)), 620);
    window.setTimeout(() => {
      window.clearInterval(progressTimer);
      setIsProcessing(false);
      setShowResult(true);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }, 1900);
  }, [photo]);

  const downloadPreview = useCallback(() => {
    if (!photo) return;
    const image = new Image();
    image.onload = () => {
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.filter = "saturate(1.35) contrast(1.08) sepia(.14)";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.filter = "none";
      context.globalAlpha = 0.1;
      for (let i = 0; i < 6000; i += 1) {
        const tone = i % 2 ? 20 : 255;
        context.fillStyle = `rgb(${tone} ${tone} ${tone})`;
        context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.2, 1.2);
      }
      context.globalAlpha = 1;
      context.font = `700 ${Math.max(18, canvas.width / 35)}px sans-serif`;
      context.fillStyle = "#fff8ec";
      context.fillText("✦", canvas.width * 0.08, canvas.height * 0.16);
      context.fillStyle = "#ef553f";
      context.fillText("♥", canvas.width * 0.84, canvas.height * 0.88);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "turnphotoart-local-preview.png";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    image.src = photo.url;
  }, [photo]);

  return (
    <div id="top">
      <div className="paper-noise" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader />
        <main>
          <section className="hero" aria-labelledby="hero-title">
            <span className="hero-spark spark-one" aria-hidden="true">✦</span>
            <span className="hero-spark spark-two" aria-hidden="true">✧</span>
            <p className="hero-eyebrow"><span /> Photos, with more personality</p>
            <h1 id="hero-title">Turn your favourite photo into <em>playful artwork</em></h1>
            <p className="hero-copy">{PRODUCT.description}</p>
            <a className="button button-primary hero-cta" href="#studio">Make it playful ✨</a>
            <p className="trust-line"><span aria-hidden="true">✓</span> Your photo stays in your browser during this preview.</p>
            <div className="mini-gallery" aria-label="Examples of the playful visual direction">
              <span className="mini-card coral">BOLD<br />SHAPES</span><span className="mini-card blue">WARM<br />COLOUR</span><span className="mini-card yellow">HANDMADE<br />TEXTURE</span>
            </div>
          </section>
          <UploadStudio imageUrl={photo?.url ?? null} fileName={photo?.file.name ?? ""} error={error} isProcessing={isProcessing} onFile={acceptFile} onRemove={clearPhoto} onGenerate={generate} />
          {isProcessing ? <ProgressState message={PREVIEW_CONFIG.progressMessages[progressIndex]} /> : null}
          {showResult && photo ? <ResultPreview imageUrl={photo.url} split={split} onSplitChange={setSplit} onDownload={downloadPreview} onReset={clearPhoto} /> : null}
          <InfoSections />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
