const userItemSelect = document.getElementById('user-item')
const userItemImg = document.getElementById('user-item-img')
const searchInput = document.getElementById('search')
const typeSelect = document.getElementById('item-type')
const matchImg = document.getElementById('img-matches')
const matchName = document.getElementById('item-name')
const matchDesc = document.getElementById('item-description')
const matchPrice = document.getElementById('item-price')

let allData = {}
toTitleCase = str => str.replace(/_/g, ' ').split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

fetch('data/skins.json')
.then(res => res.json())
.then(data => {
    allData = data

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

        const currentColor = item.mainColor?.toLowerCase() || '';
        const matchType = selectedType === 'knife' ? 'glove' : 'knife'

        const matches = Object.entries(data).filter(([_, i]) => {
            if (matchType === 'knife' && !i.knife) return false
            if (matchType === 'glove' && !i.glove) return false
            return i.mainColor?.toLowerCase() === currentColor;
        })

        if (matches.length > 0) {
            const [matchNameKey, matchItem] = matches[Math.floor(Math.random() * matches.length)]
            const matchImage = matchType === 'knife' ? matchItem.knife : matchItem.glove
            matchImg.src = matchImage
            matchImg.alt = toTitleCase(matchNameKey)
            matchName.textContent = toTitleCase(matchNameKey)
            matchDesc.textContent = matchItem.description
            matchPrice.textContent = matchType === 'knife' ? matchItem.knife_price : matchItem.glove_price
        }
    }
    })
})