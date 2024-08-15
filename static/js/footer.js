class Footer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <footer id="footer" class="footer mt-auto py-3">
          <div class="container">
            <div class="row">
              <div class="col-md-4">
                <h5>Site Map</h5>
                <ul class="list-unstyled">
                  <li><a href="/">Home</a></li>
                  <li><a href="/portfolio.html">Portfolio</a></li>
                  <li><a href="/voice_over.html">Voice Over</a></li>
                  <li><a href="https://store.gitchegumi.com">Merch</a></li>
                </ul>
              </div>
              <div class="col-md-4">
                <h5>Social Media</h5>
                <ul class="list-unstyled">
                  <li><a href="https://www.facebook.com/GitchegumiGaming" target="_blank">Facebook</a></li>
                  <li><a href="https://www.instagram.com/gitchegumi" target="_blank">Instagram</a></li>
                  <li><a href="https://twitter.com/GitchegumiGames" target="_blank">Twitter</a></li>
                  <li><a href="https://www.twitch.tv/gitchegumi" target="_blank">Twitch</a></li>
                </ul>
              </div>
              <div class="col-md-4">
                <p>&copy; 2024 GitcheGumi Media LLC. All rights reserved.</p>
                <p>Designed and developed by Mathew Lindholm</p>
              </div>
            </div>
          </div>
        </footer>
      `;
    }
  }
  
  customElements.define('footer-component', Footer);