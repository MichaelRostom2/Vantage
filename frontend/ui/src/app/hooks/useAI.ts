import { useState, useCallback } from 'react';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function useAI() {
  const [storefrontUrl, setStorefrontUrl] = useState<string | null>(null);
  const [storefrontLoading, setStorefrontLoading] = useState(false);
  const [storefrontError, setStorefrontError] = useState<string | null>(null);
  const [floorplanUrl, setFloorplanUrl] = useState<string | null>(null);
  const [floorplanLoading, setFloorplanLoading] = useState(false);
  const [floorplanError, setFloorplanError] = useState<string | null>(null);

  const generateStorefront = useCallback(async (address: string, businessType?: string) => {
    setStorefrontLoading(true);
    setStorefrontUrl(null);
    setStorefrontError(null);
    try {
      const res = await client.images.generate({
        model: 'dall-e-3',
        prompt: `A photorealistic street-level photograph of a modern renovated ${businessType || 'retail'} storefront at ${address}, New York City. Large glass windows, contemporary signage, warm lighting, clean modern materials. Golden hour, pedestrians walking by. Architectural photography.`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });
      setStorefrontUrl(res.data[0].url ?? null);
    } catch (err: any) {
      console.error('Storefront generation failed:', err);
      setStorefrontError(err.message || 'Storefront generation failed');
    } finally {
      setStorefrontLoading(false);
    }
  }, []);

  const generateFloorplan = useCallback(async (sqft: number | string, businessType?: string) => {
    setFloorplanLoading(true);
    setFloorplanUrl(null);
    setFloorplanError(null);
    try {
      const res = await client.images.generate({
        model: 'dall-e-3',
        prompt: `A clean, professional architectural floor plan for a ${sqft || 2000} sq ft ${businessType || 'retail'} commercial space in New York City. Top-down blueprint view showing: entrance, sales floor, storage room, restroom, and counter area. Clean lines, labeled rooms with dimensions, minimalist style on white background. Technical drawing style.`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });
      setFloorplanUrl(res.data[0].url ?? null);
    } catch (err: any) {
      console.error('Floor plan generation failed:', err);
      setFloorplanError(err.message || 'Floor plan generation failed');
    } finally {
      setFloorplanLoading(false);
    }
  }, []);

  const resetPropertyAI = useCallback(() => {
    setStorefrontUrl(null);
    setStorefrontError(null);
    setFloorplanUrl(null);
    setFloorplanError(null);
  }, []);

  return {
    storefrontUrl, storefrontLoading, storefrontError, generateStorefront,
    floorplanUrl, floorplanLoading, floorplanError, generateFloorplan,
    resetPropertyAI,
  };
}
