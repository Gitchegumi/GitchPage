class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `  
    <header>
            <div class="container" id="top_material">
            <img src="images/Mascot.png" alt="Gitchegumi Logo" width="147" height="100">
            <h1>GitcheGumi Media</h1>
        </div>
        <div class="container" id="toplinks">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand"><img src="images/Media Text.png" alt="Bootstrap" width="90" height="84"></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul id="listedlinks" class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="https://store.gitchegumi.com" target="_blank">Merch</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="https://www.etsy.com/shop/GitchPrints" target="_blank">GitchPrints</a>
                    </li>
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Projects
                    </a>
                    <ul class="dropdown-menu">
                        <li><h4 class="dropdown-header">Content Creation</li>
                        <li><a class="dropdown-item" href="coming_soon.html">Blog</a></li>
                        <li><a class="dropdown-item" href="voice_over.html">Voice Over</a></li>
                        <li><a class="dropdown-item" href="http://www.youtube.com/@GitcheGumi." target="_blank">YouTube</a></li>
                        <li><a class="dropdown-item" href="https://www.twitch.tv/gitchegumi" target="_blank">Twitch</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h4 class="dropdown-header">Programing</li>
                        <li><a class="dropdown-item" href="/portfolio.html">Web Development Portfolio</a></li>
                        <li><a class="dropdown-item" href="https://github.com/Gitchegumi" target="_blank">GitHub Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h4 class="dropdown-header">Social Media</li>
                        <li><a class="dropdown-item" href="https://www.facebook.com/GitchegumiGaming" target="_blank">Facebook</a></li>
                        <li><a class="dropdown-item" href="https://www.instagram.com/gitchegumi" target="_blank">Instagram</a></li>
                        <li><a class="dropdown-item" href="https://twitter.com/GitchegumiGames" target="_blank">X / Twitter</a></li>
                    </ul>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
            </div>
            </nav>
        </div>
      </header>
    `;
  }
}

document.addEventListener("DOMContentLoaded", function() {
    var navbarLinks = document.querySelectorAll("#listedlinks .nav-link, #listedlinks .dropdown-item");

    navbarLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            localStorage.setItem("activeLink", this.href);
        });
    });

    var activeLink = localStorage.getItem("activeLink");
    if (activeLink) {
        var activeElement = document.querySelector(`[href='${activeLink}']`);
        if (activeElement) {
            activeElement.classList.add("active");
        }
    }

    // Get the header element
    const headerElement = document.getElementById('header-element');

    // Get the current page path
    const currentPagePath = window.location.pathname;

    // Update the background image based on the current page
    if (currentPagePath.endsWith( 'voice_over.html' )) {
        headerElement.classList.add('header-background-1');
    }
});

customElements.define('header-component', Header);