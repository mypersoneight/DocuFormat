import React, { useState, useCallback } from 'react';
import UploadZone from './components/UploadZone';
import FormattedViewer from './components/FormattedViewer';
import { ViewerState, FontFamily, FontSize } from './types';
import { readFileContent, detectFileType, fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [viewerState, setViewerState] = useState<ViewerState>({
    isLoading: false,
    fileData: null,
    fontFamily: 'sans',
    fontSize: 'medium'
  });

  const handleFileSelected = useCallback(async (file: File) => {
    setViewerState(prev => ({
      ...prev,
      isLoading: true,
      fileData: null,
      errorMessage: undefined
    }));

    try {
      const type = detectFileType(file);
      const content = await readFileContent(file, type);
      const base64 = await fileToBase64(file);
      
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        fileData: {
          name: file.name,
          type: type,
          mimeType: file.type || 'application/octet-stream',
          base64: base64,
          size: file.size,
          content: content
        }
      }));
    } catch (error) {
      console.error(error);
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        errorMessage: "Failed to read file. Please ensure it is a valid supported format.",
      }));
    }
  }, []);

  const handleReset = () => {
    setViewerState(prev => ({
      ...prev,
      fileData: null,
      errorMessage: undefined
    }));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    setViewerState(prev => ({ ...prev, fontFamily }));
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    setViewerState(prev => ({ ...prev, fontSize }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📂</span>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DocuFormat
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Upload Section */}
        {!viewerState.fileData ? (
           <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
             <div className="text-center max-w-2xl mx-auto space-y-4">
               <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                 Universal Document Viewer
               </h2>
               <p className="text-lg text-slate-600">
                 Securely view Word documents, PowerPoint presentations, Excel spreadsheets, and Text files directly in your browser.
               </p>
             </div>
             
             <div className="w-full">
               <UploadZone 
                 onFileSelected={handleFileSelected} 
                 isLoading={viewerState.isLoading} 
               />
             </div>

             {viewerState.errorMessage && (
                <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl border border-red-200 flex items-center space-x-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span>{viewerState.errorMessage}</span>
                   <button onClick={handleReset} className="underline font-semibold hover:text-red-800 ml-2">Try Again</button>
                </div>
             )}
           </div>
        ) : (
           <FormattedViewer 
             fileData={viewerState.fileData}
             fontFamily={viewerState.fontFamily}
             fontSize={viewerState.fontSize}
             onFontFamilyChange={handleFontFamilyChange}
             onFontSizeChange={handleFontSizeChange}
             onReset={handleReset}
           />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        <p>Processed locally in your browser.</p>
      </footer>

      <style>{`
        /* Minimal Reset for HTML from Docx */
        .whitespace-pre-wrap p { margin-bottom: 1em; }
        .whitespace-pre-wrap h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .whitespace-pre-wrap h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
        .whitespace-pre-wrap ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .whitespace-pre-wrap ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;