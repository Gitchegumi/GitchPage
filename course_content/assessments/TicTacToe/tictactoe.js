document.querySelectorAll('td').forEach(function(td) {
    td.addEventListener('click', function() {
        if (td.textContent === '') {
            td.textContent = 'X';
        } else if (td.textContent === 'X') {
            td.textContent = 'O';
        } else if (td.textContent === 'O') {
            td.textContent = '';
        }
    });
});
document.querySelector('#reset').addEventListener('click', function() {
    document.querySelectorAll('td').forEach(function(td) {
        td.textContent = '';
    });
});