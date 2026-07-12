"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ImagePlus, Sparkles, Trash2, Upload } from "lucide-react";
import { PREVIEW_CONFIG } from "@/lib/turn-photo-art";

type UploadStudioProps = {
  imageUrl: string | null;
  fileName: string;
  error: string;
  isProcessing: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
  onGenerate: () => void;
};

export function UploadStudio({ imageUrl, fileName, error, isProcessing, onFile, onRemove, onGenerate }: UploadStudioProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFirstFile = (files: FileList | null) => {
    if (files?.[0]) onFile(files[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFirstFile(event.dataTransfer.files);
  };

  return (
    <section className="studio" id="studio" aria-labelledby="studio-title">
      <div className="studio-copy">
        <span className="section-kicker"><span /> Your photo studio</span>
        <h2 id="studio-title">Start with a photo you love.</h2>
        <p>Portrait, pet, plate or place — if it matters to you, it belongs here.</p>
        <div className="privacy-note"><span aria-hidden="true">✓</span><p><b>Private by default</b><br />Nothing leaves your browser in this preview.</p></div>
      </div>

      <div className="upload-card">
        <input
          ref={inputRef}
          id="photo-upload"
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            selectFirstFile(event.target.files);
            event.target.value = "";
          }}
          aria-describedby={error ? "upload-error upload-formats" : "upload-formats"}
        />
        {imageUrl ? (
          <div className="selected-photo">
            <div className="selected-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Selected photo preview" />
              <span>Ready to play</span>
            </div>
            <div className="selected-meta">
              <div><ImagePlus aria-hidden="true" /><p><b>{fileName}</b><span>Photo ready</span></p></div>
              <div className="selected-actions">
                <button type="button" onClick={() => inputRef.current?.click()}>Replace</button>
                <button type="button" className="remove-button" onClick={onRemove} aria-label="Remove selected photo"><Trash2 size={17} aria-hidden="true" /> Remove</button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`dropzone${isDragging ? " is-dragging" : ""}`}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false); }}
            onDrop={handleDrop}
          >
            <div className="upload-icon" aria-hidden="true"><Upload /></div>
            <h3>Drop your photo here</h3>
            <p>or choose one from your device</p>
            <button className="button button-blue" type="button" onClick={() => inputRef.current?.click()}>Choose a photo</button>
            <span id="upload-formats">JPEG, PNG or WebP · Up to {PREVIEW_CONFIG.maxFileBytes / 1024 / 1024} MB</span>
          </div>
        )}
        {error ? <p className="upload-error" id="upload-error" role="alert">{error}</p> : null}
        <button className="button button-primary generate-button" type="button" onClick={onGenerate} disabled={isProcessing}>
          <Sparkles size={20} aria-hidden="true" /> {isProcessing ? "Making it playful…" : "Make it playful ✨"}
        </button>
        <p className="local-line"><span aria-hidden="true">●</span> Local preview only — no AI service is called</p>
      </div>
    </section>
  );
}
