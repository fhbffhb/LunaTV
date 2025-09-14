import { NextResponse } from 'next/server';

// 标记为动态路由
export const dynamic = 'force-dynamic';

// 服务端专用函数，直接调用外部API
async function getShortDramaCategoriesInternal() {
  const response = await fetch('https://api.r2afosne.dpdns.org/vod/categories', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const categories = data.categories || [];
  return categories.map((item: any) => ({
    type_id: item.type_id,
    type_name: item.type_name,
  }));
}

export async function GET() {
  try {
    const categories = await getShortDramaCategoriesInternal();

    // 设置与网页端一致的缓存策略：分类缓存4小时
    const maxAge = 4 * 60 * 60; // 4小时转秒
    const response = NextResponse.json(categories);
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
    response.headers.set('Vary', 'Accept-Encoding');

    return response;
  } catch (error) {
    console.error('获取短剧分类失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}