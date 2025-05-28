import React, { useState } from 'react';

const formatText = (text, wordsPerLine = 5) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    return lines;
};

const Expandable5Text = ({ text, maxLines = 2, wordsPerLine = 5 }) => {
    const [expanded, setExpanded] = useState(false);
    const lines = formatText(text, wordsPerLine);

    const visibleLines = expanded ? lines : lines.slice(0, maxLines);

    return (
        <div>
            {visibleLines.map((line, index) => (
                <div key={index}>{line}</div>
            ))}
            {lines.length > maxLines && (
                <div>
                    <button
                        className="text-blue-500 underline text-sm mt-1 cursor-pointer"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Expandable5Text;
