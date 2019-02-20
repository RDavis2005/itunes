// Functions
const container = document.querySelector('.container');
const artistImage = document.querySelector('.artist');
const media = document.querySelector('.media');
const overlay = document.querySelector('.overlay');
const searchElem = document.querySelector('#search');

// Getting content from iTunes API
const getContent = (search) => {
    const url = new URL('https://itunes.apple.com/search');
    const params = { term: search, media: 'musicVideo' };
    url.search = new URLSearchParams(params);
    fetch(url, { method: 'POST' })
        .then(results => results.json())
        .then(data => {
            const resultsHTML = data.results.map(result => `
                <div style="background-image: url(${result.artworkUrl100.replace('100x100','200x200')});" 
                onclick="openMedia('${result.previewUrl}', '${result.trackCensoredName}')" class="result"></div>
                `
            ).join('');
            container.innerHTML = resultsHTML;
            return fetch(data.results[0].artistViewUrl);
        })
        .then(data => data.text())
        .then(data => {
            const artistImgUrl = data.match(/https?:\/\/[a-zA-Z0-9:\/\.\-]+.jpg/)[0];
            artistImage.style['background-image'] = `url(${artistImgUrl})`;
        })
};

// When the user opens media
const openMedia = (url, title) => {
    media.innerHTML = `<video controls autoplay src="${url}"></video><p>${title}</p>`;
    media.classList.remove('hidden');
    toggleOverlay();
}

// When user closes media
const closeMedia = () => {
    media.innerHTML = '';
    toggleOverlay();
}

const toggleOverlay = () => {
    overlay.classList.toggle('blur');
    document.querySelectorAll('.result').forEach(result => result.classList.toggle('blur'));
}

// When user clicks on overlay (anywhere on page), close the media
overlay.addEventListener('click', closeMedia);

// When user clicks Enter after typing in artist name
searchElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getContent(searchElem.value);
    }
});