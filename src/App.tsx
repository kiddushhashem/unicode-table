import React, { useState, useEffect } from 'react';
import { loadUnicodeData, UnicodeSymbol } from "./Unicode";

const UnicodeSearchTable: React.FC = () => {
    const [unicodeData, setUnicodeData] = useState<UnicodeSymbol[]>([]);
    const [query, setQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UnicodeSymbol[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleCopyValue = (e: React.MouseEvent<HTMLElement>) => {
        let target = (e.target as HTMLElement)
        if (target.className === 'symbol-cell') {
            navigator.clipboard.writeText(target.innerText).then(() => {
                target.classList.add('copied');
                setTimeout(() => target.classList.remove('copied'), 1000);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!unicodeData || !unicodeData.length) return;
        setIsLoading(true);
        const filteredResults = unicodeData.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.char.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filteredResults);
        requestAnimationFrame(() => {
            setIsLoading(false);
        })
    };

    const loadDataOnce = async () => {
        try {
            const url = "/unicode-table/UnicodeData.txt";
            const data = await loadUnicodeData(url);
            setUnicodeData(data);
            setFilteredData(data);
            requestAnimationFrame(() => {
                setIsLoading(false);
            })
        } catch (error) {
            console.error("Error loading data:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDataOnce();
    }, []);

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', boxSizing: 'border-box' }}>
            {isLoading ? (
                <div className="loader">
                    <div className="loader-wheel"></div>
                </div>
            ) : (
                <div onClick={handleCopyValue} className={'table-container'}>
                    {filteredData.map((item, index) => (<div className='symbol-cell' key={index}>{item.char}</div>))}
                </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ padding: '8px', fontSize: '14px' }}
                    />
                    <button onClick={handleButtonClick} >🡲</button>
                </div>
            </div>
        </div>
    );
};

export default UnicodeSearchTable;
