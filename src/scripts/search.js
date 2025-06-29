const params = new URLSearchParams(window.location.search)
const search = params.get('search')?.toLowerCase() || ''
const filter = params.get('filter')?.split(',') || []
const minPrice = parseInt(params.get('minPrice')) || 0
const maxPrice = parseInt(params.get('maxPrice')) || Infinity

fetch('data/skins.json')
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.querySelector('#results')
        const filtredItems = Object.entries(data).filter(([key, item]) => {
            const matchesSearch = key.toLowerCase().includes(search)

            let matchesType = true
            let matchesColor = true
            let matchesPrice = true

            if (filter.includes('knives') && !item.knife) matchesType = false
            if (filter.includes('gloves') && !item.glove) matchesType = false

            const colorFilters = filter.filter(f => !['knives', 'gloves'].includes(f))

            if (colorFilters.length > 0) {
                matchesColor = colorFilters.some(color => item.color.toLowerCase().includes(color))
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

        if (filtredItems.length > 0) {
            filtredItems.forEach(([key, item]) => {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'item__div'


                let innerHTML = `<h2 class="item__name"><a href="item-info.html?item=${key}">${key}</a></h2>`

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