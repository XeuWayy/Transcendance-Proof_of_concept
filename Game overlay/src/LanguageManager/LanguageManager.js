class LanguageManager {
    constructor() {
        this.langMap  = {english: 'en', french: 'fr'}
        this.preferedLanguage = localStorage.getItem('language') || 'english'
    }

    async updateContent(wantedObject) {
        const langData = await this.fetchLanguageData(this.preferedLanguage, wantedObject)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n')
            if (langData[key]) {
                element.innerHTML = langData[key]
            }
        })
    }

    setLanguagePreference(lang) {
        this.preferedLanguage = lang
        localStorage.setItem('language', lang)
    }

    async fetchLanguageData(lang, wantedObject) {
        const folder = this.langMap[lang]
        try {
            const response = await fetch(`../../locales/${folder}/${lang}.json`)
            const json = await response.json()
            return wantedObject === 'overlay' ? json.overlay : json.threejs
        } catch (error) {
            console.error(`Erreur while loading language data: ${error}`)
            return {}
        }
    }

    async changeLanguage(lang, wantedObject) {
        await this.setLanguagePreference(lang)
        
        this.updateContent(wantedObject)
    }
}

export default LanguageManager