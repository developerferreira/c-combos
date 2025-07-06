const userItemSelect = document.getElementById('user-item')
const userItemImg = document.getElementById('user-item-img')
const searchInput = document.getElementById('search')
const typeSelect = document.getElementById('item-type')
const matchImg = document.getElementById('img-matches')
const matchName = document.getElementById('item-name')
const matchPrice = document.getElementById('item-price')

let allData = {}
toTitleCase = str => str.replace(/_/g, ' ').split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

fetch('data/skins.json')
.then(res => res.json())
.then(data => {
    allData = data

    const matchSelect = document.getElementById('match-selector')
    matchSelect.addEventListener('change', () => {
        const selectedMatchKey = matchSelect.value
        const selectedType = typeSelect.value
        const matchType = selectedType === 'knife' ? 'glove' : 'knife'
        const matchItem = allData[selectedMatchKey]

        if (matchItem) {
            const matchImage = matchType === 'knife' ? matchItem.knife : matchItem.glove
            matchImg.src = matchImage
            matchImg.alt = toTitleCase(selectedMatchKey)
            matchName.textContent = toTitleCase(selectedMatchKey)
            matchPrice.textContent = matchType === 'knife' ? matchItem.knife_price : matchItem.glove_price
        }
    })

    typeSelect.addEventListener('change', () => {
        const selectedType = typeSelect.value
        userItemSelect.innerHTML = '<option disabled selected>Selecionar</option>'

        Object.entries(data).forEach(([key, item]) => {
            const hasItem = selectedType === 'knife' ? item.knife : item.glove
            if (hasItem) {
                const option = document.createElement('option')
                option.value = key
                option.textContent = toTitleCase(key)
                userItemSelect.appendChild(option)
            }
        })
    })

    userItemSelect.addEventListener('change', () => {
        const selectedName = userItemSelect.value
        const selectedType = typeSelect.value
        const item = data[selectedName]

        if (item) {
            const imageSrc = selectedType === 'knife' ? item.knife : item.glove
            userItemImg.src = imageSrc
            userItemImg.alt = toTitleCase(selectedName)

            const currentColor = item.mainColor?.toLowerCase() || ''
            const matchType = selectedType === 'knife' ? 'glove' : 'knife'

            const matches = Object.entries(data).filter(([_, i]) => {
                if (matchType === 'knife' && !i.knife) return false
                if (matchType === 'glove' && !i.glove) return false
                const currentColors = (item.mainColor || '').toLowerCase().split(/,|&/).map(c => c.trim())
                const matchColors = (i.mainColor || '').toLowerCase().split(/,|&/).map(c => c.trim())

                return currentColors.some(color => matchColors.includes(color))
            })

            const matchSelect = document.getElementById('match-selector')
            matchSelect.innerHTML = '<option disabled selected>Opções sugeridas</option>'

            matches.forEach(([matchKey, matchItem]) => {
                const opt = document.createElement('option')
                opt.value = matchKey
                opt.textContent = toTitleCase(matchKey)
                matchSelect.appendChild(opt)
            })

            if (matches.length > 0) {
                matchSelect.selectedIndex = 1
                matchSelect.dispatchEvent(new Event('change'))
            }
        }
    })
})