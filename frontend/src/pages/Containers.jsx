import React from 'react';
import { Box, Terminal, Cpu } from 'lucide-react';

export default function Containers() {
  return (
    <div className="space-y-4">
      {/* Resend Pure Black Integration Card */}
      <div className="ops-card p-6 sm:p-8 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-10 h-10 rounded-[6px] bg-[#000000] border border-[#292D30] flex items-center justify-center text-[#9281F7] mb-3">
          <Box className="w-5 h-5" />
        </div>

        <h2 className="text-base font-bold text-[#FFFFFF] tracking-tight mb-1">
          Container Telemetry Disconnected
        </h2>

        <p className="text-xs text-[#A1A4A5] max-w-md mb-4 leading-relaxed">
          Connect the Docker daemon socket to stream real-time container health, uptime, and resource metrics.
        </p>

        {/* Integration Instructions */}
        <div className="w-full text-left bg-[#000000] border border-[#292D30] rounded-[6px] p-3.5 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[#A1A4A5] pb-2 border-b border-[#292D30]">
            <span className="flex items-center gap-1.5 text-[#FFFFFF] font-medium text-xs">
              <Terminal className="w-3.5 h-3.5 text-[#9281F7]" />
              Docker Telemetry Socket Mount
            </span>
            <span className="text-[10px] uppercase bg-[#000000] border border-[#292D30] px-1.5 py-0.5 rounded-[4px] text-[#A1A4A5] font-mono font-medium">
              Optional Sidecar
            </span>
          </div>

          <p className="text-[#A1A4A5] text-[11px] font-sans">
            To stream Docker container metrics, mount the host Docker socket into the telemetry daemon:
          </p>

          <div className="bg-[#000000] p-2.5 rounded-[6px] border border-[#292D30] text-[#9281F7] select-all overflow-x-auto text-xs font-mono">
            <code>docker run -v /var/run/docker.sock:/var/run/docker.sock opsmonitor-agent</code>
          </div>

          <div className="pt-0.5 text-[11px] text-[#6E727A] flex items-center gap-1.5 font-sans">
            <Cpu className="w-3.5 h-3.5 text-[#6E727A] shrink-0" />
            <span>The daemon will automatically ingest container metadata and stream live CPU/Memory utilization.</span>
          </div>
        </div>
      </div>
    </div>
  );
}


