import { google } from 'googleapis'

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
}

export async function getDriveClient() {
  const auth = getAuth()
  return google.drive({ version: 'v3', auth })
}

export async function findFolderByPath(pathParts: string[]): Promise<string | null> {
  const drive = await getDriveClient()
  let currentParentId = ROOT_FOLDER_ID

  for (const part of pathParts) {
    const res = await drive.files.list({
      q: `'${currentParentId}' in parents AND name = '${part}' AND mimeType = 'application/vnd.google-apps.folder' AND trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1,
    })

    const folder = res.data.files?.[0]
    if (!folder?.id) return null
    currentParentId = folder.id
  }

  return currentParentId
}

export async function getFileByPath(folderPath: string[], filename: string): Promise<DriveFile | null> {
  const drive = await getDriveClient()
  const folderId = await findFolderByPath(folderPath)
  if (!folderId) return null

  const res = await drive.files.list({
    q: `'${folderId}' in parents AND name = '${filename}' AND trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    pageSize: 1,
  })

  const file = res.data.files?.[0]
  if (!file?.id) return null

  return {
    id: file.id,
    name: file.name ?? filename,
    mimeType: file.mimeType ?? 'image/png',
    thumbnailUrl: `https://lh3.googleusercontent.com/d/${file.id}=s1200`,
    downloadUrl: `https://drive.google.com/uc?export=view&id=${file.id}`,
  }
}

export async function getFilesInFolder(folderPath: string[]): Promise<DriveFile[]> {
  const drive = await getDriveClient()
  const folderId = await findFolderByPath(folderPath)
  if (!folderId) return []

  const res = await drive.files.list({
    q: `'${folderId}' in parents AND trashed = false AND mimeType contains 'image/'`,
    fields: 'files(id, name, mimeType, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 50,
  })

  return (res.data.files ?? []).map((file) => ({
    id: file.id!,
    name: file.name ?? '',
    mimeType: file.mimeType ?? 'image/jpeg',
    thumbnailUrl: `https://lh3.googleusercontent.com/d/${file.id}=s1200`,
    downloadUrl: `https://drive.google.com/uc?export=view&id=${file.id}`,
  }))
}

export async function getFileById(fileId: string): Promise<DriveFile | null> {
  const drive = await getDriveClient()

  try {
    const res = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType',
    })

    const file = res.data
    if (!file?.id) return null

    return {
      id: file.id,
      name: file.name ?? '',
      mimeType: file.mimeType ?? 'image/jpeg',
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${file.id}=s1200`,
      downloadUrl: `https://drive.google.com/uc?export=view&id=${file.id}`,
    }
  } catch {
    return null
  }
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailUrl: string
  downloadUrl: string
}

export function getDriveImageUrl(fileId: string, size = 1200): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=s${size}`
}

export function parseDrivePath(path: string): { folders: string[]; filename: string } {
  const parts = path.split('/')
  const filename = parts.pop() ?? ''
  return { folders: parts.filter(Boolean), filename }
}
