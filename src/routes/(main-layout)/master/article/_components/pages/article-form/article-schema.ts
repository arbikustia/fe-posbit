import dayjs from 'dayjs';
import { z } from 'zod';

export const articleSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	author: z.string().min(1, 'Author is required'),
	content: z.string().min(1, 'Content is required'),
	isPublish: z.boolean(),
	publishDate: z.string().default(dayjs().format('YYYY-MM-DD')),
	tags: z.array(z.string()).min(1, 'At least one tag is required')
});
