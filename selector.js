(function() {
    let overlay;
    let selectedElement;
    let rotationDegrees;
    let highlightedElement;
    let currentOutline;
    let currentOutlineOffset;
    let currentTransition;
    let currentAnimation;

    let elementStates = new Map();

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '2147483647';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
    }

    function removeOverlay() {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    function handleMouseover(event) {
        if (highlightedElement) {
            handleMouseout({ target: highlightedElement });
        }

        currentOutline = event.target.style.outline
        currentOutlineOffset = event.target.style.outlineOffset
        currentAnimation = event.target.style.animation
        currentTransition = event.target.style.transition

        highlightedElement = event.target;
        if (!elementStates.has(highlightedElement)) {
            elementStates.set(highlightedElement, {
                originalTransform: highlightedElement.style.transform,
                currentRotation: 0
            });
        }

        highlightedElement.style.outline = '2px solid transparent';
        highlightedElement.style.outlineOffset = '2px';
        highlightedElement.style.transition = 'outline-color 0.5s';
        highlightedElement.style.animation = 'rainbow 2s linear infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { outline-color: darkseagreen; }
                33% { outline-color: cornflowerblue; }
                66% { outline-color: mediumpurple; }
            }
        `;
        document.head.appendChild(style);
    }

    function handleMouseout(event) {
        event.target.style.outline = '';
        event.target.style.outlineOffset = '';
        event.target.style.transition = '';
        event.target.style.animation = '';
        highlightedElement = null;
    }

    function handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        selectedElement = event.target;
        let state = elementStates.get(selectedElement);
    
        if (!state) {
            state = {
                originalTransform: selectedElement.style.transform || getComputedStyle(selectedElement).transform,
                currentRotation: 0
            };
            elementStates.set(selectedElement, state);
        }
    
        // Apply transition every time
        selectedElement.style.transition = 'transform 0.2s ease';
    
        if (rotationDegrees === 0) {
            selectedElement.style.transform = state.originalTransform;
            state.currentRotation = 0;
        } else {
            state.currentRotation = (state.currentRotation + rotationDegrees) % 360;
            let newTransform = `rotate(${state.currentRotation}deg)`;
            if (state.originalTransform && state.originalTransform !== 'none') {
                newTransform = `${newTransform} ${state.originalTransform}`;
            }
            selectedElement.style.transform = newTransform;
        }
    
        selectedElement.style.outline = currentOutline;
        selectedElement.style.outlineOffset = currentOutlineOffset;
        selectedElement.style.animation = currentAnimation;
    
        elementStates.set(selectedElement, state);
        cleanupAndRemoveListeners();
    
        // Remove transition after it's complete
        setTimeout(() => {
            selectedElement.style.transition = '';
        }, 200);
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            cleanupAndRemoveListeners();
        }
    }

    function cleanupAndRemoveListeners() {
        removeOverlay();
        document.removeEventListener('mousemove', handleMouseover, true);
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleKeyDown, true);
        if (highlightedElement) {
            handleMouseout({ target: highlightedElement });
        }
    }

    browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "activate_selector") {
            rotationDegrees = request.degrees;
            createOverlay();
            document.addEventListener('mousemove', handleMouseover, true);
            document.addEventListener('click', handleClick, true);
            document.addEventListener('keydown', handleKeyDown, true);
        }
    });
})();
