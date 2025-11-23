'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CMSData {
  content: Record<string, string>;
  colors: Record<string, string>;
}

export default function CMSPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'seo' | 'blog'>('content');
  const [content, setContent] = useState<Record<string, string>>({});
  const [colors, setColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newContentKey, setNewContentKey] = useState('');
  const [newContentValue, setNewContentValue] = useState('');
  const [newColorKey, setNewColorKey] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');

  useEffect(() => {
    fetchCMSData();
  }, []);

  const fetchCMSData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cms');
      if (res.ok) {
        const data: CMSData = await res.json();
        setContent(data.content || {});
        setColors(data.colors || {});
      }
    } catch (error) {
      console.error('Error fetching CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (key: string, value: string) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        await fetchCMSData();
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveColor = async (key: string, value: string) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/cms/color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        await fetchCMSData();
      }
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color');
    } finally {
      setSaving(false);
    }
  };

  const handleAddContent = async () => {
    if (!newContentKey || !newContentValue) return;
    await handleSaveContent(newContentKey, newContentValue);
    setNewContentKey('');
    setNewContentValue('');
  };

  const handleAddColor = async () => {
    if (!newColorKey || !newColorValue) return;
    await handleSaveColor(newColorKey, newColorValue);
    setNewColorKey('');
    setNewColorValue('#000000');
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Content Management System</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage website content, colors, SEO settings, and blog cities
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-800">
        {(['content', 'colors', 'seo', 'blog'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Content</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Content Key (e.g., homepage_title)"
                value={newContentKey}
                onChange={(e) => setNewContentKey(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              />
              <input
                type="text"
                placeholder="Content Value"
                value={newContentValue}
                onChange={(e) => setNewContentValue(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              />
            </div>
            <button
              onClick={handleAddContent}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Content
            </button>
          </div>

          <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Existing Content</h3>
            <div className="space-y-4">
              {Object.entries(content).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-400"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newContent = { ...content };
                      newContent[key] = e.target.value;
                      setContent(newContent);
                    }}
                    className="flex-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                  />
                  <button
                    onClick={() => handleSaveContent(key, content[key])}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Color</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Color Key (e.g., primary_color)"
                value={newColorKey}
                onChange={(e) => setNewColorKey(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                />
              </div>
            </div>
            <button
              onClick={handleAddColor}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Color
            </button>
          </div>

          <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Existing Colors</h3>
            <div className="space-y-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-400"
                  />
                  <div className="flex gap-2 flex-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...colors };
                        newColors[key] = e.target.value;
                        setColors(newColors);
                      }}
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...colors };
                        newColors[key] = e.target.value;
                        setColors(newColors);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveColor(key, colors[key])}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
          <p className="text-slate-400 mb-4">
            SEO functionality will be implemented here. You can manage meta tags, titles, descriptions, and Open Graph settings for each page.
          </p>
          <Link
            href="/admin-panel/cms/seo"
            className="text-blue-400 hover:text-blue-300"
          >
            Go to SEO Settings →
          </Link>
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === 'blog' && (
        <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Blog Cities</h3>
          <p className="text-slate-400 mb-4">
            Manage blog content for different cities. Add, edit, or delete city-specific blog posts.
          </p>
          <Link
            href="/admin-panel/cms/blog"
            className="text-blue-400 hover:text-blue-300"
          >
            Manage Blog Cities →
          </Link>
        </div>
      )}
    </div>
  );
}

