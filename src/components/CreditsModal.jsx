import React from "react";
import {
  X,
  Github,
  Code2,
  ExternalLink,
  Radio,
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function CreditsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with App Branding */}
        <div className="relative p-6 bg-gradient-to-br from-spotify-dark to-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-spotify-green flex items-center justify-center shadow-lg shadow-spotify-green/20">
              <Radio className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                  SpotiFree
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-spotify-green text-black px-2 py-0.5 rounded-full">
                  v2.0.0
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Complete Music Streaming • No Login Required
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Developer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-spotify-green flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                Lead Developer & Creator
              </span>
              <span className="text-xs text-neutral-400 font-mono">2026</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-spotify-green to-teal-400 flex items-center justify-center text-black font-black text-lg shadow-md">
                  DS
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                    DannyStark
                    <Award className="w-4 h-4 text-spotify-green fill-spotify-green" />
                  </h4>
                  <p className="text-xs text-neutral-400">@Dannystark-07</p>
                </div>
              </div>

              <a
                href="https://github.com/Dannystark-07"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black hover:bg-spotify-green text-xs font-bold transition-all shadow hover:scale-105"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed pt-1 border-t border-white/5">
              Architected and built SpotiFree v2 with React, Vite, and decentralized music streaming protocols to make ad-free, full-length music accessible to everyone worldwide.
            </p>
          </div>

          {/* Project Details */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
              Project Specifications
            </h5>
            <div className="grid grid-cols-2 gap-2 text-neutral-300 font-mono">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Application
                </span>
                <span className="font-semibold text-white">SpotiFree</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Version
                </span>
                <span className="font-semibold text-spotify-green">v2.0.0 (Release)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  License
                </span>
                <span className="font-semibold text-white">MIT License</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Authentication
                </span>
                <span className="font-semibold text-white">None (100% Free)</span>
              </div>
            </div>
          </div>

          {/* Technology & Open Source Credits */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
              Technologies & Open Source Credits
            </h5>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Audius Open Music Protocol</strong>
                  <p className="text-neutral-400 text-[11px]">
                    Decentralized network powering full-length audio streaming, search, and global top charts.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">React 18 & Vite 6</strong>
                  <p className="text-neutral-400 text-[11px]">
                    Lightning-fast modern frontend runtime and reactive state engine.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Tailwind CSS & Lucide Icons</strong>
                  <p className="text-neutral-400 text-[11px]">
                    Spotify-inspired custom dark aesthetic, fluid responsive layout, and iconography.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* GitHub Repository Link */}
          <div className="pt-2">
            <a
              href="https://github.com/Dannystark-07/SpotiFree-v.2"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code on GitHub (Dannystark-07/SpotiFree-v.2)</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-900/50 border-t border-white/5 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>by</span>
          <a
            href="https://github.com/Dannystark-07"
            target="_blank"
            rel="noreferrer"
            className="text-white font-bold hover:text-spotify-green hover:underline"
          >
            DannyStark
          </a>
          <span>• © 2026</span>
        </div>
      </div>
    </div>
  );
}
