import { NextRequest, NextResponse } from 'next/server'
import { getFileByPath, getFilesInFolder, parseDrivePath } from '@/lib/drive'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const folder = searchParams.get('folder')

  if (folder) {
    // Return all images in a folder
    const folderParts = folder.split('/').filter(Boolean)
    try {
      const files = await getFilesInFolder(folderParts)
      return NextResponse.json({ files }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        },
      })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch folder', files: [] }, { status: 200 })
    }
  }

  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  try {
    const { folders, filename } = parseDrivePath(path)
    const file = await getFileByPath(folders, filename)

    if (!file) {
      return NextResponse.json({ error: 'File not found', file: null }, { status: 200 })
    }

    return NextResponse.json({ file }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch file', file: null }, { status: 200 })
  }
}
