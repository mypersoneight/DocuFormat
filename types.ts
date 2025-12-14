export type SupportedFileType = 'text' | 'document' | 'presentation' | 'spreadsheet';

export interface FileData {
  name: string;
  type: SupportedFileType;
  mimeType: string;
  base64: string;
  size: number;
  // Content can be string (html/text), string[] (slides), or any[][] (spreadsheet rows)
  content: string | string[] | any[][]; 
}

export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large';

export interface ViewerState {
  isLoading: boolean;
  fileData: FileData | null;
  errorMessage?: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
}