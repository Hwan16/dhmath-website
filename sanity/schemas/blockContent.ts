import { defineType, defineArrayMember } from 'sanity';

export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '본문', value: 'normal' },
        { title: '제목 1', value: 'h1' },
        { title: '제목 2', value: 'h2' },
        { title: '제목 3', value: 'h3' },
        { title: '인용구', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: '굵게', value: 'strong' },
          { title: '기울임', value: 'em' },
          { title: '밑줄', value: 'underline' },
          { title: '형광펜', value: 'highlight' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: '링크',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: '이미지 설명',
        },
        {
          name: 'alt',
          type: 'string',
          title: '대체 텍스트',
        },
      ],
    }),
  ],
});

