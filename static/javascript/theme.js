function setTheme(theme) {
    const lightThemeLink = document.getElementById('light-theme');
    const darkThemeLink = document.getElementById('dark-theme');

    if (theme === 'dark') {
        lightThemeLink.disabled = true;
        darkThemeLink.disabled = false;
        document
            .documentElement
            .classList
            .add('sl-theme-dark');
        document
            .documentElement
            .setAttribute('data-theme', 'dark');

        // todo fix this
        // if (typeof editor !== 'undefined' && editor !== null) {
        //     editor.setOption('theme', 'dracula');
        // }

        document
            .documentElement
            .classList
            .remove('sl-theme-light');
    } else {
        lightThemeLink.disabled = false;
        darkThemeLink.disabled = true;
        document
            .documentElement
            .classList
            .add('sl-theme-light');
        document
            .documentElement
            .setAttribute('data-theme', 'light');

        // if (typeof editor !== 'undefined' && editor !== null) {
        //     editor.setOption('theme', 'default');
        // }

        document
            .documentElement
            .classList
            .remove('sl-theme-dark');
    }

    localStorage.setItem('theme', theme);
}