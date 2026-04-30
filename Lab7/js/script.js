document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    let categoriesData = [];

    document.getElementById("catalog-link").addEventListener("click", function (e) {
        e.preventDefault();
        loadCatalog();
    });

    function loadCatalog() {
        fetch("data/categories.json")
            .then(response => response.json())
            .then(categories => {
                categoriesData = categories;
                
                let html = "<h2 class='text-center mb-4'>Каталог товарів</h2><div class='row'>";
                
                categories.forEach(cat => {
                    html += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="loadCategory('${cat.shortname}')">
                                <div class="card-body text-center">
                                    <h4 class="card-title">${cat.name}</h4>
                                    <p class="card-text text-muted">${cat.notes}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                html += "</div>";

                html += `
                    <div class="text-center mt-5">
                        <button class="btn btn-warning btn-lg shadow" onclick="loadSpecials()">
                            🌟 Specials (Випадкова категорія)
                        </button>
                    </div>
                `;
                
                mainContent.innerHTML = html;
            })
            .catch(error => console.error("Помилка завантаження категорій:", error));
    }

    window.loadCategory = function (shortname) {
        fetch(`data/${shortname}.json`)
            .then(response => response.json())
            .then(data => {
                let html = `<h2 class="text-center mb-4">${data.categoryName}</h2><div class="row">`;
                
                data.items.forEach(item => {
                    html += `
                        <div class="col-md-3 mb-4">
                            <div class="card h-100 shadow-sm text-center">
                                <img src="https://placehold.co/200x200/e9ecef/495057?text=${encodeURIComponent(item.shortname)}" 
                                     class="card-img-top mx-auto mt-3 rounded" 
                                     style="width: 180px; height: 180px; object-fit: cover;" 
                                     alt="${item.name}">
                                
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text flex-grow-1 small">${item.description}</p>
                                    <div class="mt-auto">
                                        <span class="badge bg-success fs-6">${item.price} грн</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                html += "</div>";
                
                html += `
                    <div class="text-center mt-4">
                        <button class="btn btn-secondary" onclick="document.getElementById('catalog-link').click()">
                            ⬅ Повернутися до каталогу
                        </button>
                    </div>
                `;
                
                mainContent.innerHTML = html;
            })
            .catch(error => console.error(`Помилка завантаження товарів категорії ${shortname}:`, error));
    };

    window.loadSpecials = function () {
        if (categoriesData.length === 0) return;
        const randomIndex = Math.floor(Math.random() * categoriesData.length);
        const randomCategory = categoriesData[randomIndex];
        
        loadCategory(randomCategory.shortname);
    };

    loadCatalog();
});
