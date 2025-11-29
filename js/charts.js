// Chart and visualization functionality
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initPieCharts();
        this.initBarCharts();
        this.initMapInteractions();
    }

    initPieCharts() {
        // Initialize pie chart in scale section
        const pieChart = document.querySelector('.pie-visual');
        if (pieChart) {
            this.createPieChart(pieChart);
        }
    }

    createPieChart(container) {
        // Pie chart is created with CSS conic-gradient
        // This function handles interactions
        const segments = container.querySelectorAll('.pie-slice');
        
        segments.forEach(segment => {
            segment.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.2)';
                this.style.transform = 'scale(1.05)';
            });

            segment.addEventListener('mouseleave', function() {
                this.style.filter = 'brightness(1)';
                this.style.transform = 'scale(1)';
            });
        });
    }

    initBarCharts() {
        // Initialize bar charts in dynamics section
        const barStacks = document.querySelectorAll('.bar-stack');
        
        barStacks.forEach(barStack => {
            this.enhanceBarChart(barStack);
        });
    }

    enhanceBarChart(barStack) {
        const segments = barStack.querySelectorAll('.bar-segment');
        
        segments.forEach(segment => {
            segment.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.15)';
                this.style.zIndex = '10';
            });

            segment.addEventListener('mouseleave', function() {
                this.style.filter = 'brightness(1)';
                this.style.zIndex = '1';
            });

            // Add click for mobile
            segment.addEventListener('click', function() {
                const title = this.getAttribute('title');
                if (title) {
                    this.classList.toggle('active');
                    
                    if (this.classList.contains('active')) {
                        this.innerHTML += `<div class="segment-tooltip">${title}</div>`;
                    } else {
                        const tooltip = this.querySelector('.segment-tooltip');
                        if (tooltip) tooltip.remove();
                    }
                }
            });
        });

        // Animate bars on scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateBars(barStack);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(barStack);
    }

    animateBars(barStack) {
        const segments = barStack.querySelectorAll('.bar-segment');
        
        segments.forEach((segment, index) => {
            const originalHeight = segment.style.height;
            segment.style.height = '0%';
            
            setTimeout(() => {
                segment.style.transition = 'height 1s ease-out';
                segment.style.height = originalHeight;
            }, index * 200);
        });
    }

    initMapInteractions() {
        const frontAreas = document.querySelectorAll('.front-area');
        const frontItems = document.querySelectorAll('.front-item');
        
        // Map areas hover
        frontAreas.forEach(area => {
            area.addEventListener('mouseenter', () => {
                const frontId = area.dataset.front;
                this.highlightFront(frontId);
            });

            area.addEventListener('mouseleave', () => {
                this.resetFrontHighlights();
            });
        });

        // List items click
        frontItems.forEach(item => {
            item.addEventListener('click', () => {
                const frontId = item.dataset.front;
                this.selectFront(frontId);
            });
        });
    }

    highlightFront(frontId) {
        // Reset all
        this.resetFrontHighlights();
        
        // Highlight selected
        const area = document.querySelector(`.front-area[data-front="${frontId}"]`);
        const item = document.querySelector(`.front-item[data-front="${frontId}"]`);
        
        if (area) area.style.opacity = '1';
        if (item) item.classList.add('hover');
    }

    selectFront(frontId) {
        this.resetFrontHighlights();
        
        const area = document.querySelector(`.front-area[data-front="${frontId}"]`);
        const item = document.querySelector(`.front-item[data-front="${frontId}"]`);
        
        if (area) {
            area.style.opacity = '1';
            area.style.filter = 'brightness(1.3)';
        }
        if (item) item.classList.add('active');
    }

    resetFrontHighlights() {
        document.querySelectorAll('.front-area').forEach(area => {
            area.style.opacity = '0.7';
            area.style.filter = 'brightness(1)';
        });
        
        document.querySelectorAll('.front-item').forEach(item => {
            item.classList.remove('hover', 'active');
        });
    }

    // Dynamic chart updates
    updateChart(type, data) {
        switch(type) {
            case 'yearly':
                this.updateYearlyChart(data);
                break;
            case 'fronts':
                this.updateFrontsChart(data);
                break;
        }
    }

    updateYearlyChart(data) {
        // Implementation for updating yearly chart
        console.log('Updating yearly chart with:', data);
    }

    updateFrontsChart(data) {
        // Implementation for updating fronts chart
        console.log('Updating fronts chart with:', data);
    }
}

// Initialize chart manager
document.addEventListener('DOMContentLoaded', function() {
    window.chartManager = new ChartManager();
});