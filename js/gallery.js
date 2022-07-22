const GalleryClassName = "gallery";
const GalleryLineClassName = "gallery-line";
const GallerySlideClassName = "gallery-slide";
const GalleryDotsClassName = "gallery-dots";
const GalleryDotActiveClassName = "gallery-dot-active";
const GalleryNavClassName = "gallery-nav";
const GalleryNavLeftClassName = "gallery-nav-left";
const GalleryNavRightClassName = "gallery-nav-Right";

class Gallery {
    constructor(element, options = {}) {
        this.containerNode = element;

        this.size = element.childElementCount;
        this.curentSlide = 0;
        this.curentSlideWasChanged = false;
        this.setting = {
            margin: options.margin || 0
        }
        this.manageHTML = this.manageHTML.bind(this);
        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this);
        this.manageHTML();
        this.setParameters();
        this.setEvents();

    }
    manageHTML() {
        this.containerNode.classList.add(GalleryClassName);
        this.containerNode.innerHTML = `
                <div class = "${GalleryLineClassName}">
                ${this.containerNode.innerHTML}
                </div>
                <div class= "${GalleryNavClassName}">
                <button class= "${GalleryNavLeftClassName}">>Left</button>
                <button class= "${GalleryNavRightClassName}">Right</button>
                </div>
                <div class = "${GalleryDotsClassName}"></div>
                `;
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`);

        this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
            wrapElementByDiv({
                element: childNode,
                className: GallerySlideClassName
            })
        );

    }
    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = coordsContainer.width;
        this.maximumX = -(this.size - 1) * this.width;
        this.x = -this.curentSlide * (this.width + this.setting.margin);
        this.resetStyleTransition();
        this.lineNode.style.width = `${this.size * (this.width+this.setting.margin)}px`;

        this.setStylePosition();
        Array.from(this.slideNodes).forEach((slideNode) => {
            slideNode.style.width = `${this.width}px`;
            slideNode.style.marginRight = `${this.setting.margin}px`;
        });
    }
    setEvents() {
        this.debouncedResizeGallery = debounce(this.resizeGallery);
        window.addEventListener('resize', this.debouncedResizeGallery);
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
        window.addEventListener('pointercancel', this.stopDrag);

    }
    destroyEvents() {
        window.removeEventListener('resize', this.debouncedResizeGallery);
        this.lineNode.removeEventListener('pointerdown', this.startDrag);
        window.removeEventListener('pointerup', this.stopDrag);
        window.removeEventListener('pointercancel', this.stopDrag);
    }
    resizeGallery() {
        this.setParameters();
    }
    startDrag(evt) {
        this.curentSlideWasChanged = false;
        this.clickX = evt.pageX;
        this.startX = this.x;
        this.resetStyleTransition();
        window.addEventListener('pointermove', this.dragging);
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        this.x = -this.curentSlide * (this.width + this.setting.margin);
        this.setStylePosition();
        this.setStyleTransition();
    }

    dragging(evt) {
        this.dragX = evt.pageX;
        const dragShift = this.dragX - this.clickX;
        const easing = dragShift / 5;
        this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
        this.setStylePosition();
        if (
            dragShift > 20 &&
            dragShift > 0 &&
            !this.curentSlideWasChanged &&
            this.curentSlide > 0
        ) {
            this.curentSlideWasChanged = true;
            this.curentSlide = this.curentSlide - 1;
        }
        if (
            dragShift < -20 &&
            dragShift < 0 &&
            !this.curentSlideWasChanged &&
            this.curentSlide < this.size - 1
        ) {
            this.curentSlideWasChanged = true;
            this.curentSlide = this.curentSlide + 1;
        }
    }
    setStylePosition() {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
    }
    setStyleTransition() {
        this.lineNode.style.transition = `all 0.5s ease 0s`;
    }
    resetStyleTransition() {
        this.lineNode.style.transition = `all 0s ease 0s`;
    }
}

function wrapElementByDiv({ element, className }) {
    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add(className);
    element.parentNode.insertBefore(wrapperNode, element);
    wrapperNode.appendChild(element);

    return wrapperNode;
}

function debounce(func, time = 100) {
    let timer;
    return function(event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event);
    }
}