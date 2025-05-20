// Google Analytics için yardımcı fonksiyonlar
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

declare const window: Window & typeof globalThis;

// Sayfa görüntüleme olayını gönder
export const pageview = (page_path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-939ZJEW1J2', {
      page_path,
    });
  }
};

// Özel bir olay gönder
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}; 