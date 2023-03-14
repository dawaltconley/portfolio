class SpotlightButton {
  element: HTMLElement;
  isAnimating: boolean = false;
  size: {
    w: number;
    h: number;
  };
  constructor(e: HTMLElement) {
    this.element = e;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.size = {
      w: this.element.clientWidth,
      h: this.element.clientHeight,
    };

    e.addEventListener('mouseenter', () => this.addListener(), {
      passive: true,
    });
    e.addEventListener('mouseleave', () => this.removeListener(), {
      passive: true,
    });
  }

  updateSize(): void {
    this.size.w = this.element.clientWidth;
    this.size.h = this.element.clientHeight;
  }

  onMouseMove({ offsetX, offsetY }: MouseEvent): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const { w, h } = this.size;
    const adjustX = offsetX - w / 2;
    const adjustY = offsetY - h / 2;
    requestAnimationFrame(() => {
      this.element.style.setProperty(
        '--translate',
        `${(-adjustX / 4).toFixed(2)}px, ${-adjustY / 4}px`
      );
      this.isAnimating = false;
    });
  }

  addListener(): void {
    this.updateSize();
    this.isAnimating = false;
    this.element.addEventListener('mousemove', this.onMouseMove);
  }

  removeListener(): void {
    this.element.removeEventListener('mousemove', this.onMouseMove);
    this.element.style.setProperty('--translate', '0, 0');
  }
}

export { SpotlightButton };
