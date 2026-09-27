'use client';

import { useState } from 'react';

import { DEFAULT_FLOATING_CONFIG } from '@/utils/floatingMotion';

import type { FloatingMotionConfig } from '@/utils/floatingMotion';

type Props = {
  config: FloatingMotionConfig;
  onChange: (config: FloatingMotionConfig) => void;
};

const inputStyle: React.CSSProperties = {
  width: 64,
  background: '#0e0e12',
  color: '#eee',
  border: '1px solid #2a2a30',
  borderRadius: 4,
  padding: '2px 4px',
  fontSize: 11,
};

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, marginBottom: 6, color: '#eee' }}>
      {label}
      <input type="number" value={value} step={step} onChange={(e) => onChange(parseFloat(e.target.value))} style={inputStyle} />
    </label>
  );
}

function RangeField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  step?: number;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: '#9a9aa2', marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          value={value[0]}
          step={step}
          onChange={(e) => onChange([parseFloat(e.target.value), value[1]])}
          style={inputStyle}
        />
        <input
          type="number"
          value={value[1]}
          step={step}
          onChange={(e) => onChange([value[0], parseFloat(e.target.value)])}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

export function FloatingMotionDevPanel({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const set = <K extends keyof FloatingMotionConfig>(key: K, value: FloatingMotionConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const json = JSON.stringify(config, null, 2);

  const copy = () => {
    navigator.clipboard?.writeText(json).catch(() => {});
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          background: '#ffb020',
          border: 'none',
          borderRadius: 6,
          padding: '8px 12px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Motion Panel
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 320,
        background: '#141418',
        borderLeft: '1px solid #2a2a30',
        color: '#eee',
        zIndex: 9999,
        overflowY: 'auto',
        padding: 16,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <strong style={{ color: '#ffb020', fontSize: 13 }}>Floating Motion (dev)</strong>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#9a9aa2', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <NumberField label="Fade speed" value={config.FADE_FRACTION} step={0.01} onChange={(v) => set('FADE_FRACTION', v)} />
      <NumberField label="Hold length" value={config.HOLD_FRACTION} step={0.01} onChange={(v) => set('HOLD_FRACTION', v)} />
      <RangeField label="Path distance (%)" value={config.DRIFT_RANGE} onChange={(v) => set('DRIFT_RANGE', v)} />
      <RangeField label="Spread X (%)" value={config.POSITION_RANGE_X} onChange={(v) => set('POSITION_RANGE_X', v)} />
      <RangeField label="Spread Y (%)" value={config.POSITION_RANGE_Y} onChange={(v) => set('POSITION_RANGE_Y', v)} />
      <RangeField label="Tilt (deg)" value={config.TILT_RANGE} onChange={(v) => set('TILT_RANGE', v)} />
      <RangeField label="Scale" value={config.SCALE_RANGE} step={0.01} onChange={(v) => set('SCALE_RANGE', v)} />
      <RangeField label="Width (px)" value={config.CARD_WIDTH_RANGE} onChange={(v) => set('CARD_WIDTH_RANGE', v)} />
      <RangeField label="Aspect ratio" value={config.CARD_ASPECT_RANGE} step={0.01} onChange={(v) => set('CARD_ASPECT_RANGE', v)} />
      <NumberField label="Blinks/loop min" value={config.BLINK_COUNT_MIN} onChange={(v) => set('BLINK_COUNT_MIN', v)} />
      <NumberField label="Blinks/loop max" value={config.BLINK_COUNT_MAX} onChange={(v) => set('BLINK_COUNT_MAX', v)} />
      <NumberField label="Loop duration min (s)" value={config.DURATION_MIN} onChange={(v) => set('DURATION_MIN', v)} />
      <NumberField label="Loop duration max (s)" value={config.DURATION_MAX} onChange={(v) => set('DURATION_MAX', v)} />
      <NumberField
        label="Initial hold on load (s)"
        value={config.INITIAL_HOLD_SECONDS}
        step={0.1}
        onChange={(v) => set('INITIAL_HOLD_SECONDS', v)}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={copy}
          style={{ background: '#ffb020', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 600, cursor: 'pointer' }}
        >
          Copy JSON
        </button>
        <button
          onClick={() => onChange(DEFAULT_FLOATING_CONFIG)}
          style={{ background: '#2a2a30', color: '#eee', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      <textarea
        readOnly
        value={json}
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        style={{
          width: '100%',
          height: 180,
          marginTop: 8,
          background: '#0e0e12',
          color: '#9effa0',
          fontFamily: 'monospace',
          fontSize: 10,
          border: '1px solid #2a2a30',
          borderRadius: 6,
          padding: 8,
        }}
      />
    </div>
  );
}

export default FloatingMotionDevPanel;
