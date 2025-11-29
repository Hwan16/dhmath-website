import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: '게시글',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'URL 슬러그',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          { title: '아티클', value: 'article' },
          { title: '입시 전략', value: 'strategy' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: '썸네일 이미지',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'excerpt',
      title: '요약',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: '본문',
      type: 'blockContent',
    }),
    defineField({
      name: 'isPinned',
      title: '상단 고정',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
    },
    prepare({ title, category, media }) {
      const categoryLabel = category === 'article' ? '📝 아티클' : '🎯 입시 전략';
      return {
        title,
        subtitle: categoryLabel,
        media,
      };
    },
  },
});

