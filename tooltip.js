import addGlobalEventListener from './utils/addGlobalEventListener';

const tooltipContainer = document.createElement('div');
tooltipContainer.classList.add('tooltip-container');
document.body.append(tooltipContainer);
const DEFAULT_SPACING = 5;
const userSpacing = document.querySelector('[data-spacing]').dataset.spacing;
const spacing = parseInt(userSpacing) || DEFAULT_SPACING;
const POSITIONS = ['top', 'bottom', 'left', 'right'];
const MAP_POSITIONS_TO_FUNCTIONS = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
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
  if (positionTooltipTop(elementRect, tooltip)) {
    return;
  } else {
    positionTooltipBottom(elementRect, tooltip);
    return;
  }
}

function positionTooltipTop(elementRect, tooltip) {
  const tooltipRect = tooltip.getBoundingClientRect();
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
    console.log('left');
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipBottom(elementRect, tooltip) {
  const tooltipRect = tooltip.getBoundingClientRect();
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
    console.log('left');
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipLeft(elementRect, tooltip) {}
function positionTooltipRight(elementRect, tooltip) {}

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
