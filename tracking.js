document.addEventListener("DOMContentLoaded", function() {
    logEvent("view", document.location.pathname);
    
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "visible") {
            logEvent("view", document.location.pathname);
        }
    });
    
    document.addEventListener("click", function(event) {
        const element = event.target;
        const elementType = getElementType(element);
        
        logEvent("click", elementType);
    });
    
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id || "unnamed-section";
                logEvent("view", `section:${sectionId}`);
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

/**
 * @param {string} eventType 
 * @param {string} objectDetails
 */
function logEvent(eventType, objectDetails) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${objectDetails}`);
}

/**
 * @param {HTMLElement} element 
 * @return {string}
 */
function getElementType(element) {
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
    
    if (element.closest("nav")) {
        return `navigation:${element.textContent.trim()}`;
    }
    
    const sectionTypes = ["about", "profile", "education", "skills", "cv"];
    for (const type of sectionTypes) {
        if (element.closest(`#${type}`)) {
            return `${type}-section:${element.tagName.toLowerCase()}`;
        }
    }
    
    let identifier = element.tagName.toLowerCase();
    if (element.id) {
        identifier += `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
        const firstClass = element.className.split(' ')[0];
        if (firstClass) {
            identifier += `.${firstClass}`;
        }
    }
    
    return identifier;
}

function initDetailedTracking() {
    const cvLinks = document.querySelectorAll('a[href$=".pdf"]');
    cvLinks.forEach(link => {
        link.addEventListener("click", function() {
            logEvent("click", "cv-download:PDF");
        });
    });
    
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        profilePic.addEventListener("click", function() {
            logEvent("click", "profile-picture");
        });
    }
    
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener("click", function() {
            const platform = link.querySelector('i').className.split('fa-')[1] || "unknown";
            logEvent("click", `social:${platform}`);
        });
    });
}

document.addEventListener("DOMContentLoaded", initDetailedTracking);

let pageLoadTime = new Date();
window.addEventListener("beforeunload", function() {
    const timeOnPage = Math.round((new Date() - pageLoadTime) / 1000);
    logEvent("view", `page-exit:time-spent-${timeOnPage}s`);
});