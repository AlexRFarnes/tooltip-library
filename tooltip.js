import addGlobalEventListener from './utils/addGlobalEventListener';

const tooltipContainer = document.createElement('div');
tooltipContainer.classList.add('tooltip-container');
document.body.append(tooltipContainer);
const DEFAULT_SPACING = 5;
const userSpacing = document
  .querySelector('[data-spacing]')
  .dataset.spacing.split('|');
const spacing = parseInt(userSpacing) || DEFAULT_SPACING;
const userPositions = document
  .querySelector('[data-positions]')
  .dataset.positions.split('|');
const POSITIONS = [
  ...userPositions,
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'left',
  'right',
];
const MAP_POSITIONS_TO_FUNCTIONS = {
  top: positionTooltipTop,
  topLeft: positionTooltipTopLeft,
  topRight: positionTooltipTopRight,
  bottom: positionTooltipBottom,
  bottomLeft: positionTooltipBottomLeft,
  bottomRight: positionTooltipBottomRight,
  left: positionTooltipLeft,
  right: positionTooltipRight,
};

addGlobalEventListener('mouseover', '[data-tooltip]', e => {
  const tooltip = createTooltip(e.target);
  tooltipContainer.append(tooltip);
  positionTooltip(e.target, tooltip);
  e.target.addEventListener(
    'mouseleave',
    () => {
      tooltip.remove();
    },
    { once: true }
  );
});

function positionTooltip(element, tooltip) {
  const elementRect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  for (let i = 0; i < POSITIONS.length; i++) {
    const positionFunction = MAP_POSITIONS_TO_FUNCTIONS[POSITIONS[i]];
    if (
      positionFunction &&
      positionFunction(elementRect, tooltip, tooltipRect)
    ) {
      return;
    }
  }
}

function positionTooltipTop(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.top) {
    resetPosition(tooltip);
    return false;
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = 'initial';
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipTopLeft(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`;
  tooltip.style.left = `${elementRect.left - tooltipRect.width + spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.top || bounds.left) {
    resetPosition(tooltip);
    return false;
  }

  return true;
}

function positionTooltipTopRight(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`;
  tooltip.style.left = `${elementRect.right - spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.top || bounds.right) {
    resetPosition(tooltip);
    return false;
  }
  return true;
}

function positionTooltipBottom(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.bottom + spacing}px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.bottom) {
    resetPosition(tooltip);
    return false;
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = 'initial';
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipBottomLeft(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.bottom + spacing}px`;
  tooltip.style.left = `${elementRect.left - tooltipRect.width + spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.bottom || bounds.left) {
    resetPosition(tooltip);
    return false;
  }

  return true;
}

function positionTooltipBottomRight(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${elementRect.bottom + spacing}px`;
  tooltip.style.left = `${elementRect.right - spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.bottom || bounds.right) {
    resetPosition(tooltip);
    return false;
  }
  return true;
}

function positionTooltipLeft(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.left) {
    resetPosition(tooltip);
    return false;
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = 'initial';
  }

  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }
  return true;
}
function positionTooltipRight(elementRect, tooltip, tooltipRect) {
  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${elementRect.right + spacing}px`;

  // Send the tooltip instead of its rect because the rect is initially at left 0 and top 0
  const bounds = isOutOfBounds(tooltip);
  if (bounds.right) {
    resetPosition(tooltip);
    return false;
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = 'initial';
  }

  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }
  return true;
}

function isOutOfBounds(tooltip) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainer.getBoundingClientRect();
  return {
    top: tooltipRect.top <= tooltipContainerRect.top + spacing,
    bottom: tooltipRect.bottom >= tooltipContainerRect.bottom - spacing,
    left: tooltipRect.left <= tooltipContainerRect.left + spacing,
    right: tooltipRect.right >= tooltipContainerRect.right - spacing,
  };
}

function resetPosition(tooltip) {
  tooltip.style.top = 'initial';
  tooltip.style.right = 'initial';
  tooltip.style.bottom = 'initial';
  tooltip.style.left = 'initial';
}

function createTooltip(element) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.innerText = element.dataset.tooltip;
  return tooltip;
}
