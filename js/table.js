// Data table functionality
class DataTable {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        this.originalData = [];
        this.filteredData = [];
        this.sortConfig = { column: null, direction: 'asc' };
        this.init();
    }

    init() {
        if (!this.table) return;

        this.cacheElements();
        this.bindEvents();
        this.loadData();
    }

    cacheElements() {
        this.tbody = this.table.querySelector('tbody');
        this.headers = this.table.querySelectorAll('th[data-sort]');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    }

    bindEvents() {
        // Sort headers
        this.headers.forEach(header => {
            header.addEventListener('click', () => {
                this.sortTable(header.dataset.sort);
            });
        });

        // External filters
        const frontFilter = document.getElementById('front-filter');
        const yearFilter = document.getElementById('year-filter');
        const searchInput = document.getElementById('search-input');

        if (frontFilter) {
            frontFilter.addEventListener('change', () => this.filterTable());
        }
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.filterTable());
        }
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterTable());
        }
    }

    loadData() {
        // Extract data from existing table rows
        this.originalData = this.rows.map(row => ({
            element: row,
            front: row.dataset.front,
            years: row.dataset.years ? row.dataset.years.split(',') : [],
            data: this.extractRowData(row)
        }));

        this.filteredData = [...this.originalData];
    }

    extractRowData(row) {
        const cells = row.querySelectorAll('td');
        return {
            front: cells[0].textContent.trim(),
            period: cells[1].textContent.trim(),
            days: parseInt(cells[2].textContent.replace(/,/g, '')),
            killed: parseInt(cells[3].textContent.replace(/,/g, '')),
            wounded: parseInt(cells[4].textContent.replace(/,/g, '')),
            missing: parseInt(cells[5].textContent.replace(/,/g, '')),
            total: parseInt(cells[6].textContent.replace(/,/g, '')),
            daily: parseInt(cells[7].textContent.replace(/,/g, ''))
        };
    }

    sortTable(column) {
        // Update sort configuration
        if (this.sortConfig.column === column) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig = { column, direction: 'asc' };
        }

        // Update UI
        this.updateSortHeaders(column);

        // Sort data
        this.filteredData.sort((a, b) => {
            const aValue = a.data[column];
            const bValue = b.data[column];
            
            if (this.sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.renderTable();
    }

    updateSortHeaders(activeColumn) {
        this.headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (header.dataset.sort === activeColumn) {
                icon.textContent = this.sortConfig.direction === 'asc' ? '▲' : '▼';
                icon.style.opacity = '1';
            } else {
                icon.textContent = '▼';
                icon.style.opacity = '0.3';
            }
        });
    }

    filterTable() {
        const frontFilter = document.getElementById('front-filter');
        const yearFilter = document.getElementById('year-filter');
        const searchInput = document.getElementById('search-input');

        const frontValue = frontFilter ? frontFilter.value : 'all';
        const yearValue = yearFilter ? yearFilter.value : 'all';
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';

        this.filteredData = this.originalData.filter(item => {
            const frontMatch = frontValue === 'all' || item.front === frontValue;
            const yearMatch = yearValue === 'all' || item.years.includes(yearValue);
            const searchMatch = item.data.front.toLowerCase().includes(searchValue);

            return frontMatch && yearMatch && searchMatch;
        });

        this.renderTable();
    }

    renderTable() {
        // Clear existing rows
        while (this.tbody.firstChild) {
            this.tbody.removeChild(this.tbody.firstChild);
        }

        // Add filtered rows
        this.filteredData.forEach(item => {
            this.tbody.appendChild(item.element);
        });

        // Update totals
        this.updateTotals();
    }

    updateTotals() {
        const totals = {
            killed: 0,
            wounded: 0,
            missing: 0,
            total: 0
        };

        this.filteredData.forEach(item => {
            totals.killed += item.data.killed;
            totals.wounded += item.data.wounded;
            totals.missing += item.data.missing;
            totals.total += item.data.total;
        });

        // Update footer if exists
        const totalRow = this.table.querySelector('.total-row');
        if (totalRow) {
            const cells = totalRow.querySelectorAll('td');
            cells[1].textContent = totals.killed.toLocaleString();
            cells[2].textContent = totals.wounded.toLocaleString();
            cells[3].textContent = totals.missing.toLocaleString();
            cells[4].textContent = totals.total.toLocaleString();
        }
    }

    exportToCSV() {
        const headers = ['Фронт', 'Период', 'Дней', 'Убито', 'Ранено', 'Пропало без вести', 'Всего потерь', 'Потерь в день'];
        let csv = headers.join(',') + '\n';

        this.filteredData.forEach(item => {
            const row = [
                `"${item.data.front}"`,
                `"${item.data.period}"`,
                item.data.days,
                item.data.killed,
                item.data.wounded,
                item.data.missing,
                item.data.total,
                item.data.daily
            ];
            csv += row.join(',') + '\n';
        });

        return csv;
    }

    printTable() {
        const printWindow = window.open('', '_blank');
        const tableHtml = this.table.outerHTML;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Данные по фронтам Великой Отечественной войны</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .total-row { background-color: #ff6b35; color: white; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Данные по фронтам Великой Отечественной войны</h1>
                    ${tableHtml}
                    <p><small>Сгенерировано: ${new Date().toLocaleDateString()}</small></p>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
}

// Global table functions
function initTable() {
    window.dataTable = new DataTable('fronts-table');
}

function exportToCSV() {
    if (window.dataTable) {
        const csv = window.dataTable.exportToCSV();
        downloadCSV(csv, 'потери_фронтов_великой_отечественной.csv');
    }
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetFilters() {
    const frontFilter = document.getElementById('front-filter');
    const yearFilter = document.getElementById('year-filter');
    const searchInput = document.getElementById('search-input');

    if (frontFilter) frontFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    if (searchInput) searchInput.value = '';

    if (window.dataTable) {
        window.dataTable.filterTable();
    }
}

// Initialize table when DOM is loaded
document.addEventListener('DOMContentLoaded', initTable);