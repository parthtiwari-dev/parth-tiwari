export interface ResumeConfig {
  title: string
  driveSource: string
}

export const resumeConfig: ResumeConfig = {
  title: 'Parth Tiwari Resume',
  driveSource: 'https://drive.google.com/file/d/1Qiwk7z7kpgc-t-VgPV2EG_CRs9s_Y-Ke/view?usp=drive_link',
}

export function extractDriveFileId(source: string) {
  const trimmed = source.trim()

  if (!trimmed) {
    return ''
  }

  const filePathMatch = trimmed.match(/\/file\/d\/([^/]+)/)
  const idParamMatch = trimmed.match(/[?&]id=([^&]+)/)

  if (filePathMatch?.[1]) {
    return filePathMatch[1]
  }

  if (idParamMatch?.[1]) {
    return idParamMatch[1]
  }

  return /^[a-zA-Z0-9_-]{20,}$/.test(trimmed) ? trimmed : ''
}

export const resumeDriveFileId = extractDriveFileId(resumeConfig.driveSource)
export const isResumeConfigured = resumeDriveFileId.length > 0

export const resumePreviewUrl = isResumeConfigured
  ? `https://drive.google.com/file/d/${resumeDriveFileId}/preview`
  : ''

export const resumeOpenUrl = isResumeConfigured
  ? `https://drive.google.com/file/d/${resumeDriveFileId}/view`
  : ''
