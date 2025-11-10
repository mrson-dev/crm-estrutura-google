import React, { useRef } from 'react';
import { MoonIcon, SunIcon } from './icons'; // Supondo que você tenha esses ícones

interface SettingsProps {
    officeName: string;
    setOfficeName: (name: string) => void;
    officeLogoUrl: string | null;
    setOfficeLogoUrl: (url: string | null) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    themeColor: string;
    setThemeColor: (color: string) => void;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .filter(char => char && char.match(/[a-zA-Z]/))
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

const ThemeSelector: React.FC<{ currentTheme: string; setTheme: (theme: string) => void; }> = ({ currentTheme, setTheme }) => {
    const themes = [
        { name: 'sky', color: 'bg-sky-500' },
        { name: 'indigo', color: 'bg-indigo-500' },
        { name: 'rose', color: 'bg-rose-500' },
        { name: 'teal', color: 'bg-teal-500' },
    ];
    return (
        <div className="flex space-x-3">
            {themes.map(theme => (
                <button
                    key={theme.name}
                    onClick={() => setTheme(theme.name)}
                    className={`w-8 h-8 rounded-full ${theme.color} ring-2 ring-offset-2 dark:ring-offset-slate-900 transition-transform transform hover:scale-110 ${
                        currentTheme === theme.name ? 'ring-primary' : 'ring-transparent'
                    }`}
                    aria-label={`Tema ${theme.name}`}
                />
            ))}
        </div>
    );
};

{/* FIX: Update DarkModeToggle to use icons */}
const DarkModeToggle: React.FC<{ isDark: boolean; setIsDark: (isDark: boolean) => void; }> = ({ isDark, setIsDark }) => {
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center p-1 transition-colors duration-300"
        >
            <span className="sr-only">Toggle dark mode</span>
            <div
                className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform duration-300 ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
            >
                {isDark ? <MoonIcon className="w-4 h-4 text-slate-500" /> : <SunIcon className="w-4 h-4 text-yellow-500" />}
            </div>
        </button>
    );
};


const Settings: React.FC<SettingsProps> = ({ 
    officeName, setOfficeName, officeLogoUrl, setOfficeLogoUrl,
    isDarkMode, setIsDarkMode, themeColor, setThemeColor
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOfficeLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecione um arquivo de imagem.");
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const inputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-primary focus:border-primary transition-colors";

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Identidade Visual</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Nome do Escritório</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Este nome aparecerá na barra lateral.</p>
                    </div>
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            value={officeName}
                            onChange={(e) => setOfficeName(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Logo do Escritório</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Faça o upload de uma imagem quadrada (ex: 200x200px).</p>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700">
                             {officeLogoUrl ? (
                                <img src={officeLogoUrl} alt="Logo do escritório" className="w-full h-full object-contain rounded-lg p-1" />
                            ) : (
                                <span className="text-2xl font-bold text-slate-500">{getInitials(officeName)}</span>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                                accept="image/png, image/jpeg, image/svg+xml"
                                className="hidden"
                            />
                            <button onClick={triggerFileSelect} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Alterar
                            </button>
                             {officeLogoUrl && (
                                <button onClick={() => setOfficeLogoUrl(null)} className="ml-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                                    Remover
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Aparência</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Modo de Exibição</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Alterne entre os temas claro e escuro.</p>
                    </div>
                    <div className="md:col-span-2">
                        <DarkModeToggle isDark={isDarkMode} setIsDark={setIsDarkMode} />
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     <div className="md:col-span-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Cor do Tema</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Selecione a cor de destaque principal.</p>
                    </div>
                    <div className="md:col-span-2">
                       <ThemeSelector currentTheme={themeColor} setTheme={setThemeColor} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors" onClick={() => alert("As alterações foram salvas (simulado).")}>
                    Salvar Alterações
                </button>
            </div>

        </div>
    );
};

export default Settings;
