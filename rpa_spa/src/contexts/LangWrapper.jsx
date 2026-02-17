import {useContext, useState, createContext, useCallback, useMemo } from 'react';
import {IntlProvider} from 'react-intl';
import Portuguese from '../lang/ptBR.json';
import Spanish from '../lang/esES.json';


const messagesMap = {
    'pt-BR': Portuguese,
    'es-ES': Spanish
};

const LangContext = createContext();

const getInitialLocale = () => {
    const savedLocale = localStorage.getItem('language');
    if (savedLocale && messagesMap[savedLocale]) {
        return savedLocale;
    }

    const browserLocale = navigator.language;
    if (browserLocale.startsWith('es')) {
        return 'es-ES';
    }
    return 'pt-BR';
};

export const LangWrapper = (props) => {

    const [locale, setLocale] = useState(getInitialLocale);
    const [messages, setMessages] = useState(messagesMap[getInitialLocale()]);

   const setLanguage = useCallback((language) => {
        localStorage.setItem('language', language);
        setLocale(language);
        if (messagesMap[language]) {
            setMessages(messagesMap[language]);
        }
   }, []);

   const contextValue = useMemo(() => ({ setLanguage }), [setLanguage]);

   return (
       <LangContext.Provider value={contextValue}>
           <IntlProvider messages={messages} locale={locale} defaultLocale="pt-BR">
               {props.children}
           </IntlProvider>
       </LangContext.Provider>
   );
}

export const useLang = () => {
    return useContext(LangContext);
}