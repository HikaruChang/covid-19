import { NextRequest, NextResponse } from 'next/server';
import { getR2 } from '@/lib/bindings';

// GET /api/files/[...path] - 从 R2 获取文件
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // 防止路径穿越攻击
  if (path.some((segment) => segment === '..' || segment === '.' || segment.includes('\\'))) {
    return NextResponse.json({ message: 'invalid path' }, { status: 400 });
  }

  const filePath = path.join('/');
  const r2 = getR2();

  const object = await r2.get(filePath);
  if (!object) {
    return NextResponse.json({ message: 'file not found' }, { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  // 对 PDF 设置正确的 Content-Type；其他所有类型强制 attachment，防止浏览器直接渲染潜在恶意内容
  if (filePath.endsWith('.pdf')) {
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
  } else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(filePath)) {
    // 图片允许内联显示
  } else {
    headers.set('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
  }

  return new NextResponse(object.body, { headers });
}
