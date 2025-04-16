document.getElementById("confirm").addEventListener("click", function() {
    let selectedItems = [];
    document.querySelectorAll(".materials input[type='checkbox']").forEach(item => {
        if (item.checked) {
            selectedItems.push(item.parentElement.textContent.trim());
        }
    });
    
    alert("Materiais confirmados: " + selectedItems.join(", "));
});
