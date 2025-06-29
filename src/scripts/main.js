function showFilters() {
    const filter_div = document.querySelector(".filter__items")
    if (filter_div.style.display === "none" || filter_div.style.display === "") {
        filter_div.style.display = "flex"
    } else {
        filter_div.style.display = "none"
    }
}

function applyFilter() {
    const item_name = document.querySelector('#item-name')
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked')
    const selectedFilters = Array.from(checkboxes).map(cb => cb.value)

    const minPrice = document.querySelector('#min-price')
    const maxPrice = document.querySelector('#max-price')

    const params = new URLSearchParams()
    if (selectedFilters.length > 0) {
        params.set('filter', selectedFilters.join(','))
    }
    if (item_name.value) {
        params.set('search', item_name.value)
    }
    if (minPrice) {
        params.set('minPrice', minPrice.value)
    }
    if (maxPrice) {
        params.set('maxPrice', maxPrice.value)
    }

    window.location.href = 'src/search.html?' + params.toString()
}