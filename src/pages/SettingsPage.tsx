import Settings from '../components/Settings';
import React from 'react';

const SettingsPage = () => {
    // These states would typically be lifted to a context or global state manager
    const [officeName, setOfficeName] = React.useState("IntelliJuris");
    const [officeLogoUrl, setOfficeLogoUrl] = React.useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [themeColor, setThemeColor] = React.useState("sky");

    return (
        <Settings
            officeName={officeName}
            setOfficeName={setOfficeName}
            officeLogoUrl={officeLogoUrl}
            setOfficeLogoUrl={setOfficeLogoUrl}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
        />
    );
};
export default SettingsPage;
