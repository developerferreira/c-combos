const params = new URLSearchParams(window.location.search)
const itemName = params.get('item')

function formatItemName(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

fetch('data/skins.json')
    .then(response => response.json())
    .then(items => {
        if (items[itemName]) {
            const item = items[itemName]
            document.querySelector('#name').textContent = formatItemName(itemName)
            document.querySelector('#description').textContent = item.description
            document.querySelector('#knife-price').textContent = item.knife_price || '--'
            document.querySelector('#glove-price').textContent = item.glove_price || '--'

            const imgs = [item.knife, item.glove, item.gameCombo, item.inspectCombo, item.inGame_gloves, item.inGame_gloves2].filter(Boolean)

            if (imgs.length > 0) {
                let currentIndex = 0
                const sliderImg = document.querySelector('#slider-img')
                sliderImg.src = imgs[currentIndex]

                document.querySelector('#prev-btn').addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length
                    sliderImg.src = imgs[currentIndex]
                })
                document.querySelector('#next-btn').addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % imgs.length
                    sliderImg.src = imgs[currentIndex]
                })
            } else {
                document.querySelector('.slider').innerHTML = '<p>Sem imagens disponíveis para este item.</p>'
            }
            
        } else {
            document.querySelector('#item-details').innerHTML = '<p>Item não encontrado</p>'
        }
    })