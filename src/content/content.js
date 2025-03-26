/* This runs after a web page loads */
let oldHref = document.location.href;

chrome.storage.local.get("enabled", (data) => {
    const enabled = typeof data.enabled === "undefined" ? true : !!data.enabled;
    if (enabled) {
        addMinimalYoutubeClassToHtml();
        window.onload = init();
        return;
    }

    displayBody();
});

function init() {
    let bodyList = document.querySelector("body");
    let headList = document.querySelector("head");

    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                handlePageChange();
            }
            if (mutation.target.tagName == "TITLE") {
                // sometimes the title tag is in the body
                removeUnreadCountFromTitle();
            }
        });
    });

    /* Observe the title tag for changes
   This is used to remove the unread count from the title
   e.g. "(123) Rick Astley - Never Gonna Give You Up (Official Music Video)"
   to "Rick Astley - Never Gonna Give You Up (Official Music Video)"
  */
    let titleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.tagName == "TITLE") {
                removeUnreadCountFromTitle();
            }
        });
    });

    let config = {
        childList: true,
        subtree: true,
    };

    observer.observe(bodyList, config);
    titleObserver.observe(headList, config);
    handlePageChange();
    removeUnreadCountFromTitle();
}

function handlePageChange() {
    displayBody();
    document.body.style.display = "block";
    
    // Add or remove minimal-youtube class based on current page
    addMinimalYoutubeClassToHtml();
    
    // Handle home page separately
    if (window.location.pathname === "/") {
        document.body.classList.add("no-pseudo");
        replaceHomePage();
    } else {
        // Modify the navigation menu on other pages
        simplifyNavigation();
    }
}

function replaceHomePage() {

    if (window.location.pathname === "/") {
        document.querySelector("body").innerHTML = `
    <div class="home-container">
      <div class="logo">
        <a href="https://www.youtube.com">
          <svg viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000" class="style-scope yt-icon"></path><path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white" class="style-scope yt-icon"></path></g><g class="style-scope yt-icon"><g id="youtube-paths" class="style-scope yt-icon"><path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z" class="style-scope yt-icon"></path><path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z" class="style-scope yt-icon"></path><path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z" class="style-scope yt-icon"></path><path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z" class="style-scope yt-icon"></path><path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z" class="style-scope yt-icon"></path><path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1953 17.4272C80.6493 16.5476 80.8756 15.1765 80.8756 13.3092V11.3266C80.8756 9.92722 80.7854 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z" class="style-scope yt-icon"></path><path d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.8022 16.343C86.9654 16.0161 87.0496 15.4705 87.0555 14.7085L89.4886 14.8519C89.5024 14.9601 89.5093 15.1106 89.5093 15.3011C89.5093 16.4582 89.186 17.3237 88.5395 17.8952C87.8929 18.4667 86.9322 18.7536 85.6598 18.7536C84.1158 18.7536 83.0269 18.3185 82.3933 17.446C81.7597 16.5735 81.4429 15.2259 81.4429 13.4008V11.2136C81.4429 9.33452 81.7666 7.96105 82.4141 7.09558C83.0615 6.2301 84.1841 5.79736 85.7829 5.79736C86.9799 5.79736 87.8683 6.0434 88.4429 6.5366C89.0198 7.02755 89.3837 7.74617 89.5345 8.68895C89.6852 9.63172 89.7606 10.8973 89.7606 12.4849V13.8712H84.8657ZM86.8657 10.7136C86.8657 9.82774 86.8304 9.15683 86.7599 8.70548C86.6894 8.25412 86.5524 7.9347 86.3474 7.74617C86.1425 7.55764 85.8571 7.46338 85.495 7.46338C85.0519 7.46338 84.7349 7.59116 84.5439 7.84413C84.3528 8.09709 84.2349 8.50209 84.1885 9.06248C84.1421 9.62286 84.1187 10.3902 84.1187 11.3665V12.1748H86.8657V10.7136Z" class="style-scope yt-icon"></path></g></g></g></svg>
        </a>
      </div>
      
      <div class="nav-buttons">
        <a href="https://www.youtube.com/feed/history" class="nav-button">History</a>
        <a href="https://www.youtube.com/playlist?list=WL" class="nav-button">Watch Later</a>
        <a href="https://www.youtube.com/feed/subscriptions" class="nav-button">Subscriptions</a>
        <a href="https://www.youtube.com/feed/library" class="nav-button">Playlists</a>
      </div>
      
      <div class="search-group">
        <input class="search-input" placeholder="Search" autofocus />
        <button class="search-btn">
          <div class="search-icon-container">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z" class="style-scope yt-icon"></path></g></svg>
          </div>
        </button>
      </div>
    </div>
    `;

        const input = document.querySelector(".search-input");
        const searchBtn = document.querySelector(".search-btn");
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const inputValue = input.value;
                window.location.href = `https://www.youtube.com/results?search_query=${inputValue}`;
            }
        });

        searchBtn.addEventListener("click", function (e) {
            const inputValue = input.value;
            window.location.href = `https://www.youtube.com/results?search_query=${inputValue}`;
        });
    }
}

function removeUnreadCountFromTitle() {
    const title = document.title;
    // Check if title has unread count
    if (title.match(/^\(\d+\)\s*/) === null) {
        return;
    }
    // Remove unread count from title
    const newTitle = title.replace(/^\(\d+\)\s*/, "");
    document.title = newTitle;
}

function addMinimalYoutubeClassToHtml() {
    let root = document.documentElement;
    // Only add the minimal-youtube class on the home page
    if (window.location.pathname === "/") {
        root.classList.add("minimal-youtube");
    } else {
        root.classList.remove("minimal-youtube");
    }
}

function displayBody() {
    document.body.style.display = "block";
}

function simplifyNavigation() {
    // Modify the bottom navigation menu to show only our 4 options
    const simplifyInterval = setInterval(() => {
        // Target the mini guide (hamburger menu) and hide it
        const miniGuide = document.querySelector('ytd-mini-guide-renderer');
        if (miniGuide) {
            miniGuide.style.display = 'none';
        }

        // Look for the bottom navigation (mobile-style menu)
        const bottomNav = document.querySelector('ytm-pivot-bar-renderer');
        if (bottomNav) {
            clearInterval(simplifyInterval);
            
            // Clear existing items
            bottomNav.innerHTML = '';
            // Mark the navigation as modified
            bottomNav.classList.add('minimal-nav-modified');
            
            // Define our custom navigation items
            const navItems = [
                { href: '/feed/history', label: 'History', icon: 'M13.26 3C8.17 2.86 4 6.95 4 12H2.21c-.45 0-.67.54-.35.85l2.79 2.8c.2.2.51.2.71 0l2.79-2.8c.31-.31.09-.85-.36-.85H6c0-3.9 3.18-7.05 7.1-7 3.72.05 6.85 3.18 6.9 6.9.05 3.91-3.1 7.1-7 7.1-1.61 0-3.1-.55-4.28-1.48-.4-.31-.96-.28-1.32.08-.42.42-.39 1.13.08 1.49C9 20.29 10.91 21 13 21c5.05 0 9.14-4.17 9-9.26-.13-4.69-4.05-8.61-8.74-8.74zm-.51 5c-.41 0-.75.34-.75.75v3.68c0 .35.19.68.49.86l3.12 1.85c.36.21.82.09 1.03-.26.21-.36.09-.82-.26-1.03l-2.88-1.71v-3.4c0-.4-.34-.74-.75-.74z' },
                { href: '/playlist?list=WL', label: 'Watch Later', icon: 'M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z' },
                { href: '/feed/subscriptions', label: 'Subscriptions', icon: 'M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6-5-3v6l5-3zm2-12H7v1h10V3z' },
                { href: '/feed/library', label: 'Playlists', icon: 'M11 7l6 3.5-6 3.5V7zm7 13H4V6H3v15h15v-1zm3-2H6V3h15v15zM7 17h13V4H7v13z' }
            ];
            
            // Create new nav items
            navItems.forEach(item => {
                const navItem = document.createElement('a');
                navItem.href = `https://www.youtube.com${item.href}`;
                navItem.className = 'minimal-nav-item';
                navItem.innerHTML = `
                    <div class="minimal-nav-icon">
                        <svg viewBox="0 0 24 24" height="24" width="24">
                            <path d="${item.icon}"></path>
                        </svg>
                    </div>
                    <div class="minimal-nav-label">${item.label}</div>
                `;
                bottomNav.appendChild(navItem);
            });
            
            // Add custom styles
            const styleEl = document.createElement('style');
            styleEl.textContent = `
                ytm-pivot-bar-renderer {
                    display: flex;
                    justify-content: space-around;
                    background-color: white;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 8px 0;
                }
                .minimal-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: #606060;
                    font-size: 12px;
                    padding: 4px 0;
                }
                .minimal-nav-item:hover {
                    color: #f00;
                }
                .minimal-nav-icon {
                    margin-bottom: 4px;
                    fill: currentColor;
                }
                .minimal-nav-label {
                    white-space: nowrap;
                }
                @media (prefers-color-scheme: dark) {
                    ytm-pivot-bar-renderer {
                        background-color: #212121;
                        border-top: 1px solid rgba(255,255,255,0.1);
                    }
                    .minimal-nav-item {
                        color: #aaa;
                    }
                    .minimal-nav-item:hover {
                        color: #f00;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // If we can't find the mobile menu, try to create/modify the sidebar instead
        if (!bottomNav) {
            // Hide the hamburger button
            const hamburgerButton = document.querySelector('#guide-button');
            if (hamburgerButton) {
                hamburgerButton.style.display = 'none';
            }
            
            // Find the top app bar to add our navigation
            const topAppBar = document.querySelector('ytd-masthead');
            if (topAppBar && !document.querySelector('.minimal-top-nav')) {
                clearInterval(simplifyInterval);
                
                // Create navigation container
                const navContainer = document.createElement('div');
                navContainer.className = 'minimal-top-nav';
                
                // Define our custom navigation items
                const navItems = [
                    { href: '/feed/history', label: 'History' },
                    { href: '/playlist?list=WL', label: 'Watch Later' },
                    { href: '/feed/subscriptions', label: 'Subscriptions' },
                    { href: '/feed/library', label: 'Playlists' }
                ];
                
                // Create the navigation buttons
                navItems.forEach(item => {
                    const navButton = document.createElement('a');
                    navButton.href = `https://www.youtube.com${item.href}`;
                    navButton.className = 'minimal-top-nav-button';
                    navButton.innerText = item.label;
                    navContainer.appendChild(navButton);
                });
                
                // Add custom styles
                const styleEl = document.createElement('style');
                styleEl.textContent = `
                    .minimal-top-nav {
                        display: flex;
                        align-items: center;
                        margin-left: 24px;
                        gap: 16px;
                    }
                    .minimal-top-nav-button {
                        font-size: 14px;
                        text-decoration: none;
                        color: #606060;
                        padding: 8px 12px;
                        border-radius: 18px;
                        transition: background-color 0.2s;
                    }
                    .minimal-top-nav-button:hover {
                        background-color: rgba(0,0,0,0.05);
                    }
                    @media (prefers-color-scheme: dark) {
                        .minimal-top-nav-button {
                            color: #aaa;
                        }
                        .minimal-top-nav-button:hover {
                            background-color: rgba(255,255,255,0.1);
                        }
                    }
                `;
                document.head.appendChild(styleEl);
                
                // Insert after the logo
                const logo = topAppBar.querySelector('#logo');
                if (logo && logo.parentNode) {
                    logo.parentNode.insertBefore(navContainer, logo.nextSibling);
                } else {
                    // Fallback to just appending to the masthead
                    topAppBar.appendChild(navContainer);
                }
            }
        }
    }, 500);
}
