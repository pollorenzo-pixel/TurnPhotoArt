"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InfoSections } from "@/components/info-sections";
import { ProgressState } from "@/components/progress-state";
import { ResultPreview } from "@/components/result-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UploadStudio } from "@/components/upload-studio";
import { validateImageFile } from "@/lib/browser/image-validation";
import { PREVIEW_CONFIG, PRODUCT } from "@/lib/turn-photo-art";

type SelectedPhoto = { file: File; url: string; width: number; height: number };

export default function HomePage() {
  const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [split, setSplit] = useState(52);
  const photoRef = useRef<SelectedPhoto | null>(null);
  const mountedRef = useRef(true);
  const operationRef = useRef(0);
  const progressIntervalRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const cancelPendingWork = useCallback(() => {
    operationRef.current += 1;
    if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
    progressIntervalRef.current = null;
    completionTimerRef.current = null;
    scrollTimerRef.current = null;
    if (mountedRef.current) {
      setIsProcessing(false);
      setIsExporting(false);
    }
  }, []);

  useEffect(() => { photoRef.current = photo; }, [photo]);
  useEffect(() => () => {
    mountedRef.current = false;
    operationRef.current += 1;
    if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
    if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
  }, []);

  const clearPhoto = useCallback(() => {
    cancelPendingWork();
    setPhoto((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setError("");
    setExportError("");
    setShowResult(false);
    setSplit(52);
    scrollTimerRef.current = window.setTimeout(() => {
      scrollTimerRef.current = null;
      document.getElementById("choose-photo-button")?.focus();
    }, 0);
  }, [cancelPendingWork]);

  const acceptFile = useCallback(async (file: File) => {
    cancelPendingWork();
    const operation = operationRef.current;
    setError("");
    setExportError("");
    setShowResult(false);
    try {
      const dimensions = await validateImageFile(file);
      if (!mountedRef.current || operation !== operationRef.current) return;
      const url = URL.createObjectURL(file);
      setPhoto((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { file, url, ...dimensions };
      });
    } catch (validationError) {
      if (!mountedRef.current || operation !== operationRef.current) return;
      setError(validationError instanceof Error ? validationError.message : "We could not process this image. Please try another photo.");
    }
  }, [cancelPendingWork]);

  const generate = useCallback(() => {
    if (isProcessing) return;
    if (!photo) {
      setError("Add a photo first, then we can make it playful.");
      document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("choose-photo-button")?.focus();
      return;
    }
    cancelPendingWork();
    const operation = operationRef.current;
    setError("");
    setExportError("");
    setShowResult(false);
    setIsProcessing(true);
    setProgressIndex(0);
    progressIntervalRef.current = window.setInterval(() => {
      if (mountedRef.current && operation === operationRef.current) {
        setProgressIndex((value) => Math.min(value + 1, PREVIEW_CONFIG.progressMessages.length - 1));
      }
    }, 620);
    completionTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current || operation !== operationRef.current) return;
      if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      completionTimerRef.current = null;
      setIsProcessing(false);
      setShowResult(true);
      scrollTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current && operation === operationRef.current) {
          document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }, 1900);
  }, [cancelPendingWork, isProcessing, photo]);

  const downloadPreview = useCallback(() => {
    if (!photo || isExporting) return;
    const operation = operationRef.current;
    setExportError("");
    setIsExporting(true);
    const image = new Image();
    image.onload = () => {
      if (!mountedRef.current || operation !== operationRef.current) return;
      const longestEdge = Math.max(photo.width, photo.height);
      const scale = Math.min(1, PREVIEW_CONFIG.exportMaxEdge / longestEdge);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(photo.width * scale));
      canvas.height = Math.max(1, Math.round(photo.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        canvas.width = 1;
        canvas.height = 1;
        setIsExporting(false);
        setExportError("We could not export this preview. Please try again.");
        return;
      }
      context.filter = "saturate(1.35) contrast(1.08) sepia(.14)";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.filter = "none";
      context.globalAlpha = 0.1;
      const grainPoints = Math.min(7_000, Math.round((canvas.width * canvas.height) / 500));
      for (let i = 0; i < grainPoints; i += 1) {
        const tone = i % 2 ? 20 : 255;
        context.fillStyle = `rgb(${tone} ${tone} ${tone})`;
        context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
      }
      context.globalAlpha = 1;
      context.font = `700 ${Math.max(18, canvas.width / 35)}px sans-serif`;
      context.fillStyle = "#fff8ec";
      context.fillText("✦", canvas.width * 0.08, canvas.height * 0.16);
      context.fillStyle = "#ef553f";
      context.fillText("♥", canvas.width * 0.84, canvas.height * 0.88);
      canvas.toBlob((blob) => {
        canvas.width = 1;
        canvas.height = 1;
        if (!mountedRef.current || operation !== operationRef.current) return;
        setIsExporting(false);
        if (!blob) {
          setExportError("We could not export this preview. Please try again.");
          return;
        }
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "turnphotoart-playful-preview.png";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      }, "image/png");
    };
    image.onerror = () => {
      if (!mountedRef.current || operation !== operationRef.current) return;
      setIsExporting(false);
      setExportError("We could not export this preview. Please try again.");
    };
    image.src = photo.url;
  }, [isExporting, photo]);

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
            <p className="trust-line"><span aria-hidden="true">✓</span> Your photo stays in this browser tab during the preview and is not uploaded by TurnPhotoArt.</p>
            <div className="mini-gallery" aria-label="Examples of the playful visual direction">
              <span className="mini-card coral">BOLD<br />SHAPES</span><span className="mini-card blue">WARM<br />COLOUR</span><span className="mini-card yellow">HANDMADE<br />TEXTURE</span>
            </div>
          </section>
          <UploadStudio imageUrl={photo?.url ?? null} fileName={photo?.file.name ?? ""} error={error} isProcessing={isProcessing} onFile={acceptFile} onRemove={clearPhoto} onGenerate={generate} />
          {isProcessing ? <ProgressState message={PREVIEW_CONFIG.progressMessages[progressIndex]} /> : null}
          {showResult && photo ? <ResultPreview imageUrl={photo.url} split={split} onSplitChange={setSplit} onDownload={downloadPreview} onReset={clearPhoto} isExporting={isExporting} exportError={exportError} /> : null}
          <InfoSections />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
