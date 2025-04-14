export function safelyDestroy(container) {
  container.children.forEach(child => {
    if (child.interactive) {
      child.interactive = false;
    }
    if (child.eventMode) {
      child.eventMode = 'none';
    }
    if (child.removeAllListeners) {
      // Gỡ bỏ từng listener cụ thể nếu có
      child.off('pointerdown');
      child.off('pointerup');
      child.off('pointermove');
      child.off('pointerover');
      child.off('pointerout');
      // Thêm các sự kiện khác nếu cần
    }
    if (child instanceof PIXI.Container) {
      safelyDestroy(child); // Đệ quy
    }
  });

  if (container.parent) {
    container.parent.removeChild(container);
  }

  container.destroy({ children: true });
}
