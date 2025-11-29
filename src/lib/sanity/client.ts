import { createClient } from 'next-sanity';

// Sanity 클라이언트 설정
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // 프로덕션에서는 true (캐시 사용)
});

// 이미지 URL 생성을 위한 빌더 클래스
interface SanityImageAsset {
  _ref?: string;
  asset?: {
    _ref?: string;
  };
}

class ImageUrlBuilder {
  private baseUrl: string = '';
  private params: string[] = [];

  constructor(source: SanityImageAsset | null | undefined) {
    if (!source) {
      this.baseUrl = '';
      return;
    }

    const ref = source?._ref || source?.asset?._ref;
    if (!ref) {
      this.baseUrl = '';
      return;
    }

    // _ref 형식: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-');
    if (!id || !dimensions || !format) {
      this.baseUrl = '';
      return;
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    this.baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  width(w: number): ImageUrlBuilder {
    this.params.push(`w=${w}`);
    return this;
  }

  height(h: number): ImageUrlBuilder {
    this.params.push(`h=${h}`);
    return this;
  }

  fit(mode: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'): ImageUrlBuilder {
    this.params.push(`fit=${mode}`);
    return this;
  }

  url(): string {
    if (!this.baseUrl) return '';
    if (this.params.length === 0) return this.baseUrl;
    return `${this.baseUrl}?${this.params.join('&')}`;
  }
}

// 이미지 URL 생성 함수
export function urlFor(source: SanityImageAsset | null | undefined): ImageUrlBuilder {
  return new ImageUrlBuilder(source);
}

