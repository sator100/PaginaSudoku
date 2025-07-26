document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    updateIcons(isDarkMode);
    //Cambiar el tema en dispositivos mobiles.
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
})

const init = () => {
    const darkmode = localStorage.getItem('darkmode');
    const isDark = darkmode === 'true';

    if (isDark) {
        document.body.classList.add('dark');
    }

    updateIcons(isDark);

    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#1a1a2e' : '#fff');
};

const updateIcons = (isDark) => {
    document.querySelector('.bxs-sun').style.display = isDark ? 'inline-block' : 'none';
    document.querySelector('.bxs-moon').style.display = isDark ? 'none' : 'inline-block';
};


init();