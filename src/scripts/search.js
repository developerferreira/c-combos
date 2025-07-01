const params = new URLSearchParams(window.location.search)
const search = params.get('search')?.toLowerCase() || ''
const filter = params.get('filter')?.split(',') || []
const minPrice = parseInt(params.get('minPrice')) || 0
const maxPrice = parseInt(params.get('maxPrice')) || Infinity

function formatItemName(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const normalize = str => str.toLowerCase().replace(/[_\s]+/g, '');

fetch('data/skins.json')
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.querySelector('#results')
        const filtredItems = Object.entries(data).filter(([key, item]) => {
            const matchesSearch = normalize(key).includes(normalize(search));

            let matchesType = true
            let matchesColor = true
            let matchesPrice = true
            const hasKnifeFilter = filter.includes('knives')
            const hasGloveFilter = filter.includes('gloves')

            if (hasKnifeFilter && !hasGloveFilter) {
                matchesType = !!item.knife;
            } else if (!hasKnifeFilter && hasGloveFilter) {
                matchesType = !!item.glove;
            } else if (hasKnifeFilter && hasGloveFilter) {
                matchesType = !!item.knife || !!item.glove;
            }

            const colorFilters = filter.filter(f => !['knives', 'gloves'].includes(f))

            if (colorFilters.length > 0) {
                const itemColor = (item.color || '').toLowerCase();
                if (hasKnifeFilter && !hasGloveFilter) {
                    matchesColor = !!item.knife && colorFilters.some(color => itemColor.includes(color));
                } else if (!hasKnifeFilter && hasGloveFilter) {
                    matchesColor = !!item.glove && colorFilters.some(color => itemColor.includes(color));
                } else if (hasKnifeFilter && hasGloveFilter) {
                    matchesColor = (item.knife || item.glove) && colorFilters.some(color => itemColor.includes(color));
                } else {
                    matchesColor = colorFilters.some(color => itemColor.includes(color));
                }
            }

            let knifePrice = parseInt(item.knife_price) || 0
            let glovePrice = parseInt(item.glove_price) || 0

            if (filter.includes('knives') && filter.includes('gloves')) {
                matchesPrice = (
                    (knifePrice >= minPrice && knifePrice <= maxPrice) ||
                    (glovePrice >= minPrice && glovePrice <= maxPrice)
                )
            } else if (filter.includes('knives')) {
                matchesPrice = knifePrice >= minPrice && knifePrice <= maxPrice
            } else if (filter.includes('gloves')) {
                matchesPrice = glovePrice >= minPrice && glovePrice <= maxPrice
            } else {
                matchesPrice = (
                    (knifePrice >= minPrice && knifePrice <= maxPrice) ||
                    (glovePrice >= minPrice && glovePrice <= maxPrice)
                )
            }

            /*let matchesFilters = true
            if (filter.length > 0) {
                matchesFilters = filter.some(f => {
                    return (
                        (item.color.toLowerCase().includes(f))  ||
                        (f === 'gloves' && item.glove) ||
                        (f === 'knives' && item.knife)
                    )
                })
            }*/
            return matchesSearch && matchesType && matchesColor && matchesPrice
        })

        resultsDiv.innerHTML = '';

        if (filtredItems.length > 0) {
            filtredItems.forEach(([key, item]) => {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'item__div'


                let innerHTML = `<h2 class="item__name"><a href="item-info.html?item=${key}">${formatItemName(key)}</a></h2>`

                if (filter.length === 0 || filter.includes('knives')) {
                    if (item.knife) {
                        innerHTML += `<a href="item-info.html?item=${key}"><img src="${item.knife}" alt="${key} Knife" width="150"></a>`
                    }
                }

                if (filter.length === 0 || filter.includes('gloves')) {
                    if (item.glove) {
                        innerHTML += `<a href="item-info.html?item=${key}"><img src="${item.glove}" alt="${key} Glove" width="150"></a>`
                    }
                }
                innerHTML += `<hr>`
                itemDiv.innerHTML = innerHTML
                resultsDiv.appendChild(itemDiv)
            })
        } else {
            resultsDiv.innerHTML = '<p>Nenhum item encontrado. Verifique se o filtro está correto ou retire todos os filtros de cor.</p>'
        }
    })