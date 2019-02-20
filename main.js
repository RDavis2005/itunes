// Functions
const container = document.querySelector('.container');
const artistImage = document.querySelector('.artist');
const media = document.querySelector('.media');
const overlay = document.querySelector('.overlay');
const searchElem = document.querySelector('#search');

searchElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getContent(searchElem.value);
    }
});
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
        })
};

const openMedia = (url, title) => {
    media.innerHTML = `<video controls autoplay src="${url}"></video><p>${title}</p>`;
    media.classList.remove('hidden');
}

const closeMedia = () => {
    media.innerHTML = '';
}