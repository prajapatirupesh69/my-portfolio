document.addEventListener('DOMContentLoaded', () => {
            
    // --- CONSTANTS AND ELEMENTS ---
    const navbarElement = document.querySelector('.navbar');
    const preloaderContainer = document.getElementById('preloader-container');
    const loadingProgress = document.getElementById('loading-progress');
    const preloaderText = document.getElementById('preloader-text');
    const homeBox = document.getElementById('home-box');
    const navBar = document.querySelector('.navbar');
    // Select all sections (except home), the dividers, and the footer for delayed appearance
    const allSections = document.querySelectorAll('section:not(#home), hr.neon-divider, footer'); 
    const typingText = document.getElementById('typing-text');
    const staticCursor = document.getElementById('static-cursor');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    // Sentences for the typewriter effect
    const sentences = [
        "ACCESSING: Rupesh Prajapati Portfolio V2.0...",
        "INITIATING: WordPress & Shopify Customization Engine.",
        "LOCATING: Front-End Development Toolkit...",
        "STATUS: Delivering responsive, secure web solutions.",
        "INPUT: Welcome. Type 'help' for navigation."
    ];
    let sentenceIndex = 0;
    
    // Time constants for preloader
    const INITIAL_LOAD_TIME = 2000; // 2 seconds for initialization progress
    const CONFIRMATION_TIME = 1000; // 1 second for "ACCESS GRANTED"


    // --- Helper Function to get CSS Variable (More robust) ---
    function getCssVariable(variableName, defaultValue = 72) {
        try {
            const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
            const numericValue = parseInt(value.replace('px', ''));
            // Return numeric value if valid, otherwise the default
            return isNaN(numericValue) ? defaultValue : numericValue;
        } catch (e) {
            console.error(`Error reading CSS variable ${variableName}:`, e);
            return defaultValue;
        }
    }


    // --- Mobile Menu Toggle Logic ---
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            // Toggle visibility of the menu overlay
            const isVisible = mobileMenuOverlay.style.display === 'flex';
            mobileMenuOverlay.style.display = isVisible ? 'none' : 'flex';
            // Optional: Change icon (bars <-> times)
            mobileMenuToggle.querySelector('i').className = isVisible ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
            
            // Stop body scrolling when menu is open
            document.body.style.overflow = isVisible ? '' : 'hidden';
        });

        // Close mobile menu when a link is clicked
        mobileMenuOverlay.querySelectorAll('.scroll-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.style.display = 'none';
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars text-xl';
                document.body.style.overflow = ''; // Restore body scrolling
            });
        });
    }


    // --- Two-Stage Preloader Logic ---
    function hidePreloaderAndShowContent() {
        // Read the NAVBAR_HEIGHT here, ensuring CSS has had time to load
        const NAVBAR_HEIGHT = getCssVariable('--navbar-height');
        
        console.log(`[Script] Navbar Height determined as: ${NAVBAR_HEIGHT}px`);

        // 1. Start progress bar animation (CSS transition handles 2s duration)
        loadingProgress.style.width = '100%';

        // Wait for the initial 2-second load time
        setTimeout(() => {
            // 2. Change preloader text to confirmation message
            preloaderText.textContent = "ACCESS GRANTED.";
            // OPTIONAL: Make it flash for emphasis (by changing color/shadow)
            preloaderText.style.color = '#ff0044'; // Use a temporary neon color
            preloaderText.style.textShadow = '0 0 5px #ff0044, 0 0 10px #ff0044';

            // 3. Keep confirmation message visible for 1 second (CONFIRMATION_TIME)
            setTimeout(() => {
                // Restore the original neon color before hiding
                preloaderText.style.color = 'var(--neon-color)';
                preloaderText.style.textShadow = 'var(--neon-shadow-medium)';
                
                // 4. Hide Preloader
                preloaderContainer.style.opacity = '0';
                preloaderContainer.style.pointerEvents = 'none';

                // 5. Position and Show Main Home Content
                // Calculate new 'top' position to visually center the box in the space BELOW the navbar.
                // This is the line that might have caused issues if NAVBAR_HEIGHT was null/0.
                homeBox.style.top = `calc(50% + (${NAVBAR_HEIGHT / 2}px))`;
                
                // Show the box, keeping the absolute centering classes
                homeBox.classList.remove('opacity-0', 'pointer-events-none');
                homeBox.classList.add('neon-box-shadow'); // Apply final style
                
                // 6. Show Navbar and subsequent sections
                navBar.classList.remove('opacity-0', 'pointer-events-none');
                navBar.classList.add('opacity-100');

                // Show all other sections, dividers, and footer
                allSections.forEach(el => {
                    el.classList.remove('opacity-0', 'pointer-events-none');
                    el.classList.add('opacity-100');
                });


                // 7. Start typing effect after the main box transition finishes
                setTimeout(() => {
                    const homeContent = document.getElementById('home-content');
                    homeContent.classList.remove('opacity-0');
                    startTypingLoop();
                    if (staticCursor) staticCursor.style.visibility = 'visible';
                }, 500); // Give a brief moment for the home-box to settle

            }, CONFIRMATION_TIME); // Wait 1 second after initialization completes

        }, INITIAL_LOAD_TIME); // Wait 2 seconds for initialization
    }

    // Start the entire sequence
    hidePreloaderAndShowContent();
    // --- END Preloader Logic ---


    // --- Smooth Scrolling Logic ---
    // Moved inside a brief delay to ensure NAVBAR_HEIGHT is correctly calculated if needed
    setTimeout(() => {
        const NAVBAR_HEIGHT = getCssVariable('--navbar-height');
        
        document.querySelectorAll('.scroll-link').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Offset position calculation must now ONLY subtract the fixed navbar height
                    const targetPosition = targetElement.offsetTop - NAVBAR_HEIGHT;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, 50); // Small delay


    // --- Typewriter Logic ---
    async function typeSentence(sentence, eleRef, delay = 50) {
        const letters = sentence.split("");
        let i = 0;
        while(i < letters.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
            eleRef.innerHTML += letters[i];
            i++;
        }
    }

    // Continuous loop
    async function startTypingLoop() {
        const currentSentence = sentences[sentenceIndex];
        typingText.innerHTML = "";
        await typeSentence(currentSentence, typingText, 50);

        // Wait 2 seconds, then delete and move to the next sentence
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await deleteSentence(typingText, 25);
        
        sentenceIndex = (sentenceIndex + 1) % sentences.length;
        startTypingLoop(); // Loop
    }

    // Deletion function
    async function deleteSentence(eleRef, delay = 50) {
        const text = eleRef.innerHTML;
        const letters = text.split("");
        while(letters.length > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            letters.pop();
            eleRef.innerHTML = letters.join("");
        }
    }
});
