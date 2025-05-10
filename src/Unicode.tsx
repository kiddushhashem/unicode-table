export interface UnicodeSymbol {
    name: string;
    char: string;
    unicode: string;
}

const parseUnicodeData = (text: string): UnicodeSymbol[] => {
    const lines = text.split("\n")
    const data: UnicodeSymbol[] = [];
    /*const isVisibleChar = (char: string) => {
        const codePoint = char.codePointAt(0);
        // C0 (0x00-0x1F), C1 (0x7F-0x9F)
        return !(codePoint && (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)));
    };*/
    lines.forEach(line => {
        const columns = line.split(";");
        if (columns.length >= 15) { 
            const name = columns[1];
            const codePoint = parseInt(columns[0], 16);
            const char = String.fromCodePoint(codePoint);
            const unicode = `U+${columns[0]}`;
            if (name !== '<control>' && !name.startsWith('VARIATION SELECTOR')) {
                data.push({
                    name,
                    char,
                    unicode
                });
            }
        }
    });

    return data;
};

export const loadUnicodeData = async (url: string): Promise<UnicodeSymbol[]> => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const unicodeData = parseUnicodeData(text);
        return unicodeData;
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
};
