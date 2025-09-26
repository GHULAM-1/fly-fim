"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, Hash, ListOrdered } from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  height?: number;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter content...",
  required = false,
  error,
  height = 200,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';

      // Apply styles to existing content
      setTimeout(() => {
        if (editorRef.current) {
          const allElements = editorRef.current.querySelectorAll('h3, ul, ol, li, p, strong, em');
          allElements.forEach(applyStylesToElement);
        }
      }, 50);
    }
  }, [value]);

  useEffect(() => {
    // Ensure the editor is properly configured for document.execCommand
    if (editorRef.current) {
      editorRef.current.setAttribute('contentEditable', 'true');
      editorRef.current.style.outline = 'none';
    }
  }, []);

  // Function to apply styles to elements after creation
  const applyStylesToElement = (element: Element) => {
    if (element.tagName === 'H3') {
      (element as HTMLElement).style.fontSize = '1.25rem';
      (element as HTMLElement).style.fontWeight = '600';
      (element as HTMLElement).style.margin = '0.75rem 0';
      (element as HTMLElement).style.color = '#1f2937';
    } else if (element.tagName === 'UL') {
      (element as HTMLElement).style.listStyleType = 'disc';
      (element as HTMLElement).style.margin = '0.5rem 0';
      (element as HTMLElement).style.paddingLeft = '1.5rem';
    } else if (element.tagName === 'OL') {
      (element as HTMLElement).style.listStyleType = 'decimal';
      (element as HTMLElement).style.margin = '0.5rem 0';
      (element as HTMLElement).style.paddingLeft = '1.5rem';
    } else if (element.tagName === 'LI') {
      (element as HTMLElement).style.margin = '0.25rem 0';
      (element as HTMLElement).style.lineHeight = '1.5';
    } else if (element.tagName === 'P') {
      (element as HTMLElement).style.margin = '0.5rem 0';
      (element as HTMLElement).style.lineHeight = '1.5';
    } else if (element.tagName === 'STRONG') {
      (element as HTMLElement).style.fontWeight = '600';
    } else if (element.tagName === 'EM') {
      (element as HTMLElement).style.fontStyle = 'italic';
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;

      // Apply styles to all elements
      const allElements = editorRef.current.querySelectorAll('h3, ul, ol, li, p, strong, em');
      allElements.forEach(applyStylesToElement);

      onChange(content);
    }
  };

  const updateToolbarState = () => {
    forceUpdate({});
  };

  const executeCommand = (command: string, commandValue?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, commandValue);
      handleInput();
      updateToolbarState();
    }
  };

  const checkCommandState = (command: string): boolean => {
    if (!editorRef.current || !isFocused) return false;
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };

  const checkFormatBlock = (format: string): boolean => {
    if (!editorRef.current || !isFocused) return false;
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node: Node | null = selection.getRangeAt(0).startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }

        while (node && node !== editorRef.current) {
          if (node.nodeName && node.nodeName.toLowerCase() === format.toLowerCase()) {
            return true;
          }
          node = node.parentNode;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const checkInList = (listType: string): boolean => {
    if (!editorRef.current || !isFocused) return false;
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node: Node | null = selection.getRangeAt(0).startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }

        while (node && node !== editorRef.current) {
          if (node.nodeName && node.nodeName.toLowerCase() === listType.toLowerCase()) {
            return true;
          }
          node = node.parentNode;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleHeading = () => {
    if (editorRef.current) {
      editorRef.current.focus();

      // Try the simple document.execCommand first
      try {
        const isH3 = checkFormatBlock('h3');
        if (isH3) {
          document.execCommand('formatBlock', false, 'div');
          document.execCommand('formatBlock', false, 'p');
        } else {
          document.execCommand('formatBlock', false, 'h3');
        }

        handleInput();
        setTimeout(() => {
          updateToolbarState();
          // Apply styles after command execution
          if (editorRef.current) {
            const allElements = editorRef.current.querySelectorAll('h3, ul, ol, li, p, strong, em');
            allElements.forEach(applyStylesToElement);
          }
        }, 10);
      } catch (error) {
      }
    }
  };

  const handleListCommand = (listType: 'ul' | 'ol') => {
    if (editorRef.current) {
      editorRef.current.focus();

      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        // Check if we're already in a list
        const isInList = checkInList(listType);

        if (isInList) {
          // If already in a list, remove it
          const command = listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
          document.execCommand(command, false);
        } else {
          // Create a new list item at the current cursor position
          if (range.collapsed) {
            // If cursor is at an empty location, insert a new list
            const list = document.createElement(listType);
            const li = document.createElement('li');
            li.textContent = 'List item';
            list.appendChild(li);

            // Insert the list at the cursor position
            range.insertNode(list);

            // Position cursor at the end of the list item
            range.selectNodeContents(li);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // If there's selected text, wrap it in a list
            const selectedContent = range.extractContents();
            const list = document.createElement(listType);
            const li = document.createElement('li');
            li.appendChild(selectedContent);
            list.appendChild(li);

            range.insertNode(list);

            // Position cursor after the list
            range.setStartAfter(list);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }

        handleInput();
        setTimeout(() => {
          updateToolbarState();
          // Apply styles after command execution
          if (editorRef.current) {
            const allElements = editorRef.current.querySelectorAll('h3, ul, ol, li, p, strong, em');
            allElements.forEach(applyStylesToElement);
          }
        }, 10);
      } catch (error) {
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className={`border rounded-md relative ${error ? 'border-red-300' : 'border-gray-300'} ${isFocused ? 'ring-2 ring-purple-500 border-transparent' : ''}`}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className={`p-1.5 hover:cursor-pointer rounded transition-colors ${
              checkCommandState('bold')
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className={`p-1.5 hover:cursor-pointer rounded transition-colors ${
              checkCommandState('italic')
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={handleHeading}
            className={`p-1.5 hover:cursor-pointer rounded transition-colors ${
              checkFormatBlock('h3')
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
            title="Heading 3"
          >
            <Hash className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => handleListCommand('ul')}
            className={`p-1.5 hover:cursor-pointer rounded transition-colors ${
              checkInList('ul')
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleListCommand('ol')}
            className={`p-1.5 hover:cursor-pointer rounded transition-colors ${
              checkInList('ol')
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Container */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyUp={updateToolbarState}
            onMouseUp={updateToolbarState}
            className="p-3 min-h-[150px] max-h-[400px] overflow-y-auto outline-none"
            style={{
              direction: 'ltr',
              textAlign: 'left'
            }}
            suppressContentEditableWarning={true}
            dir="ltr"
          />

          {/* Placeholder */}
          {!value && !isFocused && (
            <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default WysiwygEditor;