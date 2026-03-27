'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sharp from 'sharp';

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const slug = (formData.get('slug') as string || title)
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const category_id = formData.get('category_id') as string || null;
  const meta_title = formData.get('meta_title') as string;
  const meta_description = formData.get('meta_description') as string;
  const og_image_url = formData.get('og_image_url') as string;
  const is_draft = formData.get('published') !== 'true';
  const tags = JSON.parse(formData.get('tags') as string || '[]');

  const { data: post, error } = await supabase
    .from('cms_posts')
    .insert({
      author_id: user.id,
      title,
      slug,
      type: 'news', // Default to news for blog
      content,
      excerpt,
      cover_image_url,
      category_id,
      meta_title,
      meta_description,
      og_image_url,
      is_draft,
      published_at: !is_draft ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Handle Tags
  if (tags.length > 0) {
    const tagInserts = tags.map((tagId: string) => ({
      post_id: post.id,
      tag_id: tagId
    }));
    await supabase.from('post_tags').insert(tagInserts);
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true, id: post.id };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const slug = (formData.get('slug') as string || title)
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const category_id = formData.get('category_id') as string || null;
  const meta_title = formData.get('meta_title') as string;
  const meta_description = formData.get('meta_description') as string;
  const og_image_url = formData.get('og_image_url') as string;
  const is_draft = formData.get('published') !== 'true';
  const tags = JSON.parse(formData.get('tags') as string || '[]');

  // Get current post to check status
  const { data: currentPost } = await supabase
    .from('cms_posts')
    .select('published_at')
    .eq('id', postId)
    .single();

  const isChangingToPublished = formData.get('published') === 'true';
  const newPublishedAt = isChangingToPublished 
    ? (currentPost?.published_at || new Date().toISOString()) 
    : null;

  const { error } = await supabase
    .from('cms_posts')
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      category_id,
      meta_title,
      meta_description,
      og_image_url,
      is_draft: !isChangingToPublished,
      published_at: newPublishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  // Handle Tags - Clear and Re-insert
  await supabase.from('post_tags').delete().eq('post_id', postId);
  if (tags.length > 0) {
    const tagInserts = tags.map((tagId: string) => ({
      post_id: postId,
      tag_id: tagId
    }));
    await supabase.from('post_tags').insert(tagInserts);
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true, id: postId };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('cms_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}

export async function togglePostStatus(postId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const newPublishedAt = currentStatus ? null : new Date().toISOString();

  const { error } = await supabase
    .from('cms_posts')
    .update({
      is_draft: !!currentStatus,
      published_at: newPublishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) return { error: error.message };

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}

// Category Management
export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('blog_categories')
    .insert({ name, slug, description });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('blog_categories')
    .update({ name, slug, description, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

// Tag Management
export async function createTag(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const { error } = await supabase
    .from('blog_tags')
    .insert({ name, slug });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_tags').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function getGlobalTags() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('tags');

  if (error) return { error: error.message };
  
  const allTags = (data || [])
    .flatMap(p => p.tags || [])
    .filter((v, i, a) => a && v && a.indexOf(v) === i);
    
  return { tags: allTags };
}

export async function quickCreateTag(name: string) {
  const supabase = await createClient();
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  const { data: tag, error } = await supabase
    .from('blog_tags')
    .insert({ name, slug })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { tag };
}

export async function isSlugUnique(slug: string, excludePostId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('cms_posts')
    .select('id')
    .eq('slug', slug);

  if (excludePostId) {
    query = query.neq('id', excludePostId);
  }

  const { data } = await query.limit(1);
  return !data || data.length === 0;
}

// Asset Management
export async function getAssets(limit: number = 50, offset: number = 0, search?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('blog_assets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('filename', `%${search}%`);
  }

  const { data, error, count } = await query;
  
  if (error) {
    console.error('getAssets error:', error);
    if (error.code === '42P01') {
      return { error: 'Media Gallery database table not found. Please apply the latest migration.' };
    }
    return { error: error.message };
  }
  
  return { 
    assets: data || [],
    totalCount: count || 0,
    hasMore: (count || 0) > (offset + limit)
  };
}

export async function createAsset(url: string, filename: string, fileType: string, size: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('blog_assets')
    .insert({ 
      url, 
      filename, 
      file_type: fileType, 
      size_bytes: size,
      author_id: user?.id 
    });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteAsset(id: string, fileName: string) {
  const supabase = await createClient();
  
  // 1. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from('blog-images')
    .remove([fileName]);

  if (storageError) return { error: storageError.message };

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from('blog_assets')
    .delete()
    .eq('id', id);

  if (dbError) return { error: dbError.message };

  revalidatePath('/admin/blog');
  return { success: true };
}

export async function uploadBlogImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  // 1. Validation: Max 4MB (Server limit), JPG/PNG/WebP only
  const MAX_SIZE = 4 * 1024 * 1024; 
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (file.size > MAX_SIZE) {
    return { error: 'File is too large. Max 4MB allowed.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Only JPG and PNG images are allowed' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize: If > 1MB, be more aggressive with compression
    const quality = file.size > 1 * 1024 * 1024 ? 70 : 85;

    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality })
      .toBuffer();

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) return { error: error.message };

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    // 2. Register in Asset Gallery
    const assetRes = await createAsset(publicUrl, fileName, 'image/webp', optimizedBuffer.length);
    
    if (assetRes.error) {
       console.error('Asset tracking failed:', assetRes.error);
       return { error: `Image uploaded, but gallery tracking failed: ${assetRes.error}` };
    }

    return { url: publicUrl, fileName };
  } catch (err: any) {
    console.error('Image optimization error:', err);
    return { error: 'Failed to process image' };
  }
}
