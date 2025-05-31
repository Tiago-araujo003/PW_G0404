document.querySelectorAll('.card-auditoria input, .card-auditoria textarea').forEach(element => {
    element.removeAttribute('readonly'); // Remove readonly attribute
    element.removeAttribute('disabled'); // Remove disabled attribute
});
