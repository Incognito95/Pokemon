HTMLElement.prototype.clear = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

const buildType = function (data) {
    const article = document.createElement('article');
    article.setAttribute('class', 'typesheet');
    if (data.damage_relations.half_damage_from) {
        for (let i = 0; i < data.damage_relations.half_damage_from.length; i++) {
            const weakTo = document.createElement('p');
            const weakToText = document.createTextNode(`${data.damage_relations.half_damage_from[i].name}`);
            weakTo.appendChild(weakToText);
            article.appendChild(weakTo);
        }
    }
    return article
}
const buildList = function (data) {
    const article = document.createElement('article');
    const ul = document.createElement('ul');

    article.appendChild(ul);
    if (data.previous) {
        const prev = document.createElement('a');
        const prevText = document.createTextNode('Previous');
        next.appendChild(prevText);
        article.appendChild(prev);

        const urlString = data.previous.replace('https://pokeapi.co/api/v2/', '');

        const type = urlString.split('/')[0];
        const offset = urlstring.split('/')[1].replace('?offset=', '');

        next.setAttribute('href', `?=type${type}&offset=${offset}`);
    }

    if (data.next) {
        const next = document.createElement('a');
        const nextText = document.createTextNode('Next');
        next.appendChild(nextText);
        article.appendChild(next);

        const urlString = data.next.replace('https://pokeapi.co/api/v2/', '');

        const type = urlString.split('/')[0];
        const offset = urlstring.split('/')[1].replace('?offset=', '');

        a.setAttribute('href', `href`, `?type=${type}&offset=${offset}`);
    }

    for (let i = 0; i < data.results.length; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const text = document.createTextNode(data.results[i].name);
        li.appendChild(a);
        a.appendChild(text);
        ul.appendChild(li);
        const urlString = data.results[i].url.replace('https://pokeapi.co/api/v2/', '');

        const type = urlString.split('/')[0];
        const id = urlString.split('/')[1];

        a.setAttribute('href', `?type=${type}&id=${id}`);

    }
    return article;
}

const getSingle = function (type, id) {
    fetch(`https://pokeapi.co/api/v2/${type}/${id}/`)
        .then(response => response.json())
        .then(data => {
            let sheet;
            switch (type) {
                case 'type':
                    sheet = buildType(data);
                    break;
                default:
                    sheet = buildType(data);
            }


            document.querySelector('main')
                .clear()
                .appendChild(sheet);
        });
}

const getList = function (type, offset) {
    fetch(`https://pokeapi.co/api/v2/${type}/?offset=${offset}/`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('main')
                .clear()
                .appendChild(buildList(data));
        });
};



const init = function (urlString) {
    let type = urlString.searchParams.get('type');
    let id = urlString.searchParams.get('id');
    let offset = urlString.searchParams.get('offset');
    if (id) {
        getSingle(type, id);
    } else if (offset) {
        getList(type, offset);

    }
}


document.addEventListener('DOMContentLoaded', () => {

    const links = document.querySelectorAll('header nav ul li a');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const urlString = new URL(link.href);
            let type = urlString.searchParams.get('type');
            let id = urlString.searchParams.get('id');
            let offset = urlString.searchParams.get('offset');


            history.pushState({}, '', `?type=${type}&offset=${offset}`);

            init(urlString);
        });
    });
    const urlString = new URL(window.location.href);
    init(urlString);
})