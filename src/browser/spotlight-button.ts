class SpotlightButton {
  element: HTMLElement;
  isAnimating: boolean = false;
  constructor(e: HTMLElement) {
    this.element = e;
    this.onMouseMove = this.onMouseMove.bind(this);

    e.addEventListener('mouseenter', () => this.addListener(), {
      passive: true,
    });
    e.addEventListener('mouseleave', () => this.removeListener(), {
      passive: true,
    });
  }

  onMouseMove({ offsetX, offsetY }: MouseEvent): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const adjustX = offsetX - this.element.clientWidth / 2;
    const adjustY = offsetY - this.element.clientHeight / 2;
    requestAnimationFrame(() => {
      this.element.style.setProperty(
        '--translate',
        `${(-adjustX / 4).toFixed(2)}px, ${-adjustY / 4}px`
      );
      this.isAnimating = false;
    });
  }

  addListener(): void {
    this.isAnimating = false;
    this.element.addEventListener('mousemove', this.onMouseMove);
  }

  removeListener(): void {
    this.element.removeEventListener('mousemove', this.onMouseMove);
    this.element.style.setProperty('--translate', '0, 0');
  }
}

const buttons = document.getElementsByClassName(
  'spotlight-button'
) as HTMLCollectionOf<HTMLElement>;

const spotlightButtons: SpotlightButton[] = [];
for (const button of buttons) {
  const sp = new SpotlightButton(button);
  spotlightButtons.push(sp);
}

export { spotlightButtons as buttons };
