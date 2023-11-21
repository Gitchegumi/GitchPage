class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
        #navbarSupportedContent{
            font-family: "oswald", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 1.0em;
        }
        
        .dropdown-menu{
            font-family: "oswald", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 1em;
        }
        
        .dropdown-header{
            text-align: center;
            font-family: "miller-headline", serif;
            color: #0a0524;
            font-size: 1.5em;
        }
        
        #top_material{
            background-color: #3722af;
            border: 5px solid #c27319;
            box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
            padding: 1%;
            text-align: center;
            font-family: "oswald", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 2em;
            color: #fff;
        }
        
        #toplinks{
            margin: auto;
            border: 1px solid #c27319;
            background: #3722af;
            font-family: "oswald", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 1em;
        }
    </style>  
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
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="https://www.gitchegumi.com">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="https://store.gitchegumi.com" target="_blank">Merch</a>
                    </li>
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Projects
                    </a>
                    <ul class="dropdown-menu">
                        <li><h4 class="dropdown-header">Content Creation</li>
                        <li><a class="dropdown-item" href="coming_soon.html">Blog</a></li>
                        <li><a class="dropdown-item" href="coming_soon.html">Voice Over</a></li>
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

customElements.define('header-component', Header);