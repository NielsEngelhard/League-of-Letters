"use client";

import { useState, useEffect } from 'react';
import { Translations } from './ITranslations';
import { SupportedLanguage } from './languages';
import { loadTranslations } from './utils';

export function useTranslations(lang: SupportedLanguage) {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const t = await loadTranslations(lang);
        setTranslations(t as Translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [lang]);

  return { t: translations, loading, lang };
}