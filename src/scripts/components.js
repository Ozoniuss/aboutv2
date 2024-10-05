class BusinessCard extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let path = this.getAttribute('path') ?? '';
		this.innerHTML = `
        <section class="profile-section">
        <img src="${path}/assets/mothman_cut.png" alt="" class="profile-pic" />
        <div class="profile-data">
          <div class="name">Alex Bledea</div>
          <div class="align-center info">
            <div class="position">Software Engineer</div>
            <i class="fa-solid fa-circle"></i>
            <div class="location">Cluj-Napoca, Romania</div>
          </div>
          <div class="links space-around">
            <div class="card github" onclick="openLink(\`https://github.com/Ozoniuss\`)">
              <i class="fa-brands fa-github"></i>
              <div class="media">GitHub</div>
            </div>
            <div class="card linkedin" onclick="openLink(\`https://www.linkedin.com/in/alex-bledea-a8865b1a0/\`)">
              <i class="fa-brands fa-linkedin"></i>
              <div class="media">LinkedIn</div>
            </div>
            <div class="card medium" onclick="openLink(\`https://medium.com/@ozoniuss\`)">
              <i class="fa-brands fa-medium"></i>
              <div class="media">Medium</div>
            </div>
          </div>
        </div>
      </section>
`;
	}
}

class NavMenu extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let current = this.getAttribute('current');
		let path = this.getAttribute('path') ?? '';
		this.innerHTML = `
<div class="header space-around">
    <a href="${path}/index.html" class="tab ${
			current === 'home' ? 'is-active' : ''
		}">Home</a>
    <a href="${path}/about/index.html" class="tab ${
			current === 'about' ? 'is-active' : ''
		}">About me</a>
    <a href="${path}/work/index.html" class="tab ${
			current === 'work' ? 'is-active' : ''
		}">My work</a>
    <a href=${path}/guitar/index.html class="tab ${
			current === 'guitar' ? 'is-active' : ''
		}">Guitar</a>
    <a href=${path}/blog/index.html class="tab ${
			current === 'blog' ? 'is-active' : ''
		}">Blog</a>
    <a href=${path}/must-read/index.html class="tab ${
			current === 'must-read' ? 'is-active' : ''
		}">Must Read</a>
    <a href="${path}/resume-downtime/index.html" target="_blank" class="tab">Resume</a>
</div>
`;
	}
}

class ModifiedAtItem extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		let currentDate = document.lastModified;
		this.innerHTML = `
    <p>Modified at ${currentDate}.</p>
    `;
	}
}

customElements.define('business-card', BusinessCard);
customElements.define('nav-menu', NavMenu);
customElements.define('modified-at-item', ModifiedAtItem);
