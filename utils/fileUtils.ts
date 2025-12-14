import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { SupportedFileType } from '../types';

export const validateFile = (file: File): string | null => {
  const maxSize = 20 * 1024 * 1024; // 20MB
  const allowedExtensions = ['.txt', '.docx', '.pptx', '.xlsx'];
  
  if (file.size > maxSize) {
    return "File size exceeds 20MB limit.";
  }

  const fileName = file.name.toLowerCase();
  const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!isValidExtension) {
    return "Unsupported file type. Please upload .txt, .docx, .pptx, or .xlsx.";
  }

  return null;
};

export const detectFileType = (file: File): SupportedFileType => {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) return 'document';
  if (name.endsWith('.pptx')) return 'presentation';
  if (name.endsWith('.xlsx')) return 'spreadsheet';
  return 'text';
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const readFileContent = async (file: File, type: SupportedFileType): Promise<string | string[] | any[][]> => {
  switch (type) {
    case 'text':
      return readTextFile(file);
    case 'document':
      return readDocxFile(file);
    case 'presentation':
      return readPptxFile(file);
    case 'spreadsheet':
      return readExcelFile(file);
    default:
      throw new Error("Unsupported file processing");
  }
};

const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const readDocxFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value; // The generated HTML
  } catch (error) {
    console.error("DOCX Parsing Error", error);
    throw new Error("Failed to parse Word document.");
  }
};

const readExcelFile = async (file: File): Promise<any[][]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // Convert to array of arrays
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    return jsonData;
  } catch (error) {
    console.error("Excel Parsing Error", error);
    throw new Error("Failed to parse Excel file.");
  }
};

const readPptxFile = async (file: File): Promise<string[]> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const slides: string[] = [];
    
    // Find slide files in ppt/slides/slideX.xml
    const slideFiles = Object.keys(zip.files).filter(fileName => 
      fileName.match(/ppt\/slides\/slide\d+\.xml/)
    );

    // Sort naturally (slide1, slide2, slide10)
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0");
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0");
      return numA - numB;
    });

    const parser = new DOMParser();

    for (const fileName of slideFiles) {
      const xmlString = await zip.file(fileName)?.async("string");
      if (xmlString) {
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        // Extract text from <a:t> tags
        const textNodes = xmlDoc.getElementsByTagName("a:t");
        let slideText = "";
        for (let i = 0; i < textNodes.length; i++) {
          slideText += textNodes[i].textContent + " ";
        }
        slides.push(slideText.trim() || "(No text content)");
      }
    }
    
    return slides.length > 0 ? slides : ["No slides found"];
  } catch (error) {
    console.error("PPTX Parsing Error", error);
    throw new Error("Failed to parse PowerPoint file.");
  }
};