/**
 * Event Tracking Script for Personal GitHub.io Website
 * 
 * This script tracks all user interactions (clicks and views) across the website
 * and logs them to the console with timestamp, event type, and event object details.
 */

// Initialize page view tracking
document.addEventListener("DOMContentLoaded", function() {
    // Track initial page load
    logEvent("view", document.location.pathname);
    
    // Set up visibility change detection
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "visible") {
            logEvent("view", document.location.pathname);
        }
    });
    
    // Track all click events
    document.addEventListener("click", function(event) {
        // Get element details
        const element = event.target;
        const elementType = getElementType(element);
        
        // Log the click event
        logEvent("click", elementType);
    });
    
    // Track section views using Intersection Observer
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only log view when section comes into viewport
                const sectionId = entry.target.id || "unnamed-section";
                logEvent("view", `section:${sectionId}`);
            }
        });
    }, { threshold: 0.5 }); // At least 50% of the section must be visible
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

/**
 * Log event details to console in the specified format
 * @param {string} eventType - Type of event (click/view)
 * @param {string} objectDetails - Details about the object interacted with
 */
function logEvent(eventType, objectDetails) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${objectDetails}`);
}

/**
 * Determine the type of element that was interacted with
 * @param {HTMLElement} element - The DOM element that was clicked
 * @return {string} Description of the element type and identifiers
 */
function getElementType(element) {
    // Check for common element types
    if (element.tagName === "A") {
        return `link:${element.textContent.trim().substring(0, 30)}:${element.href}`;
    } 
    else if (element.tagName === "BUTTON") {
        return `button:${element.textContent.trim()}`;
    }
    else if (element.tagName === "IMG") {
        return `image:${element.alt || "unnamed-image"}:${element.src.split('/').pop()}`;
    }
    else if (element.tagName === "INPUT") {
        return `input:${element.type}:${element.name || "unnamed-input"}`;
    }
    else if (element.tagName === "SELECT") {
        return `dropdown:${element.name || "unnamed-select"}`;
    }
    else if (element.tagName === "TEXTAREA") {
        return `textarea:${element.name || "unnamed-textarea"}`;
    }
    else if (element.classList.contains("cv-download")) {
        return "cv-download";
    }
    
    // For navigation items
    if (element.closest("nav")) {
        return `navigation:${element.textContent.trim()}`;
    }
    
    // For specific sections on your page
    const sectionTypes = ["about", "profile", "education", "skills", "cv"];
    for (const type of sectionTypes) {
        if (element.closest(`#${type}`)) {
            return `${type}-section:${element.tagName.toLowerCase()}`;
        }
    }
    
    // Default case - identify by tag name, class, and id
    let identifier = element.tagName.toLowerCase();
    if (element.id) {
        identifier += `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
        // Get first class if multiple
        const firstClass = element.className.split(' ')[0];
        if (firstClass) {
            identifier += `.${firstClass}`;
        }
    }
    
    return identifier;
}

// Enhanced tracking to identify specific content sections
function initDetailedTracking() {
    // Track CV download click specifically
    const cvLinks = document.querySelectorAll('a[href$=".pdf"]');
    cvLinks.forEach(link => {
        link.addEventListener("click", function() {
            logEvent("click", "cv-download:PDF");
        });
    });
    
    // Track profile picture views/clicks
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        profilePic.addEventListener("click", function() {
            logEvent("click", "profile-picture");
        });
    }
    
    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener("click", function() {
            const platform = link.querySelector('i').className.split('fa-')[1] || "unknown";
            logEvent("click", `social:${platform}`);
        });
    });
}

// Initialize the detailed tracking once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initDetailedTracking);

// Track time spent on the page
let pageLoadTime = new Date();
window.addEventListener("beforeunload", function() {
    const timeOnPage = Math.round((new Date() - pageLoadTime) / 1000);
    logEvent("view", `page-exit:time-spent-${timeOnPage}s`);
});