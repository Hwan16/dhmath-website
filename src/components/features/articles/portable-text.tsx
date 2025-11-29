'use client';

import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';

// Portable Text 커스텀 컴포넌트
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={urlFor(value).width(800).url()}
              alt={value.alt || '본문 이미지'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-500 hover:text-primary-600 underline"
      >
        {children}
      </a>
    ),
    highlight: ({ children }) => (
      <mark className="bg-yellow-200 px-1 rounded">{children}</mark>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-10 mb-4 text-gray-800">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-800">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-6 mb-2 text-gray-800">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-300 pl-4 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700">{children}</ol>
    ),
  },
};

interface PostBodyProps {
  body: any[];
}

export function PostBody({ body }: PostBodyProps) {
  return (
    <article className="prose prose-lg max-w-none">
      <PortableText value={body} components={components} />
    </article>
  );
}

