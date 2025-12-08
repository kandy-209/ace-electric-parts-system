/**
 * Enhanced Data Import Dashboard
 * Supports preview, progress tracking, and better UX
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface ImportPreview {
  new: any[];
  updates: Array<{ existing: any; new: any }>;
  duplicates: any[];
  invalid: Array<{ part: any; errors: string[] }>;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(null);
      setResult(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setPreviewing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parts/import/preview', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data.preview);
        showToast('Preview generated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to generate preview', 'error');
      }
    } catch (error) {
      showToast('Failed to generate preview', 'error');
    } finally {
      setPreviewing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('updateExisting', 'true');
      formData.append('skipDuplicates', 'true');

      const response = await fetch('/api/parts/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        showToast(
          `Successfully imported ${data.result.inserted} parts, updated ${data.result.updated}`,
          'success'
        );
      } else {
        showToast(data.error || 'Import failed', 'error');
      }
    } catch (error) {
      showToast('Import failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSample = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/parts/generate-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 300 }),
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        showToast(`Generated ${data.result.inserted} sample parts`, 'success');
      }
    } catch (error) {
      showToast('Failed to generate sample parts', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Data Import</h1>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Generate Sample Data</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Quickly generate 300+ sample parts for testing
            </p>
            <button
              onClick={handleGenerateSample}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Generating...' : 'Generate Sample Parts'}
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Import from File</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Upload Excel or CSV file with parts data
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="mb-4 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                disabled={!file || previewing}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
              >
                {previewing ? 'Previewing...' : 'Preview'}
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {uploading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-8 bg-white/5 p-6 rounded-lg border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Import Preview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-500/20 p-4 rounded">
                <div className="text-2xl font-bold">{preview.new.length}</div>
                <div className="text-sm text-gray-400">New Parts</div>
              </div>
              <div className="bg-yellow-500/20 p-4 rounded">
                <div className="text-2xl font-bold">{preview.updates.length}</div>
                <div className="text-sm text-gray-400">Updates</div>
              </div>
              <div className="bg-gray-500/20 p-4 rounded">
                <div className="text-2xl font-bold">{preview.duplicates.length}</div>
                <div className="text-sm text-gray-400">Duplicates</div>
              </div>
              <div className="bg-red-500/20 p-4 rounded">
                <div className="text-2xl font-bold">{preview.invalid.length}</div>
                <div className="text-sm text-gray-400">Invalid</div>
              </div>
            </div>
            {preview.invalid.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Invalid Parts:</h3>
                <div className="max-h-40 overflow-y-auto text-sm">
                  {preview.invalid.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="text-red-400 mb-1">
                      {item.part.part_number}: {item.errors.join(', ')}
                    </div>
                  ))}
                  {preview.invalid.length > 10 && (
                    <div className="text-gray-400">...and {preview.invalid.length - 10} more</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Import Result */}
        {result && (
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Import Result</h2>
            {result.success ? (
              <div className="space-y-2">
                <div className="text-green-400">✓ {result.message}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-xl font-bold">{result.result.total}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Inserted</div>
                    <div className="text-xl font-bold text-green-400">{result.result.inserted}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Updated</div>
                    <div className="text-xl font-bold text-yellow-400">{result.result.updated}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Errors</div>
                    <div className="text-xl font-bold text-red-400">{result.result.errors.length}</div>
                  </div>
                </div>
                {result.result.errors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Errors:</h3>
                    <div className="max-h-40 overflow-y-auto text-sm">
                      {result.result.errors.slice(0, 10).map((error: any, idx: number) => (
                        <div key={idx} className="text-red-400 mb-1">
                          {error.part_number}: {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-400">✗ {result.error}</div>
            )}
          </div>
        )}

        {/* Other Import Sources */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Other Import Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Google Sheets</h3>
              <p className="text-gray-400 mb-4 text-sm">Connect and sync with Google Sheets</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                Connect
              </button>
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2">PDF Catalog</h3>
              <p className="text-gray-400 mb-4 text-sm">Extract data from PDF catalogs</p>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                Upload PDF
              </button>
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2">OCR Scan</h3>
              <p className="text-gray-400 mb-4 text-sm">Scan paper records</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
