import React, { useState } from 'react';
import { FontFamily, FontSize, FileData } from '../types';

interface FormattedViewerProps {
  fileData: FileData;
  fontFamily: FontFamily;
  fontSize: FontSize;
  onFontFamilyChange: (font: FontFamily) => void;
  onFontSizeChange: (size: FontSize) => void;
  onReset: () => void;
}

const FormattedViewer: React.FC<FormattedViewerProps> = ({ 
  fileData,
  fontFamily, 
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
  onReset 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };

  const renderContent = () => {
    if (fileData.type === 'spreadsheet') {
      const rows = fileData.content as any[][];
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 ? "bg-slate-50 font-bold" : ""}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-3 text-slate-700 border-r border-slate-100 last:border-r-0">
                      {cell !== null && cell !== undefined ? String(cell) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (fileData.type === 'presentation') {
      const slides = fileData.content as string[];
      const slideContent = slides[currentSlide];
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full bg-white border-2 border-slate-200 rounded-xl shadow-sm p-12 min-h-[300px] flex items-center justify-center text-center">
             <div className="whitespace-pre-wrap max-w-2xl">
               {slideContent}
             </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-6">
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-slate-500">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    // Default: Text or HTML (Docx)
    return (
       <div className="whitespace-pre-wrap">
          {typeof fileData.content === 'string' && fileData.type === 'document' ? (
             <div dangerouslySetInnerHTML={{ __html: fileData.content }} />
          ) : (
             fileData.content as string
          )}
       </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header / Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs
              ${fileData.type === 'spreadsheet' ? 'bg-emerald-600' : fileData.type === 'presentation' ? 'bg-orange-600' : 'bg-indigo-600'}
            `}>
              {fileData.type === 'spreadsheet' ? 'XLS' : fileData.type === 'presentation' ? 'PPT' : 'DOC'}
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-800 truncate">{fileData.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
            
            {/* Font Controls - Only show for Text/Doc/PPT */}
            {fileData.type !== 'spreadsheet' && (
              <>
                <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg p-1 hidden sm:flex">
                  <button onClick={() => onFontFamilyChange('sans')} className={`p-1.5 rounded text-xs font-sans ${fontFamily === 'sans' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}>Aa</button>
                  <button onClick={() => onFontFamilyChange('serif')} className={`p-1.5 rounded text-xs font-serif ${fontFamily === 'serif' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}>Aa</button>
                  <button onClick={() => onFontFamilyChange('mono')} className={`p-1.5 rounded text-xs font-mono ${fontFamily === 'mono' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}>Aa</button>
                </div>

                <select 
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(e.target.value as FontSize)}
                  className="text-xs py-1.5 pl-2 pr-6 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 hidden sm:block"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
              </>
            )}

            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`p-8 sm:p-12 min-h-[400px] max-h-[80vh] overflow-y-auto bg-white text-slate-800 leading-relaxed ${getFontClass()} ${getSizeClass()}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FormattedViewer;