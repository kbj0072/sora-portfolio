class ComponentLoader {
    static isSubPage() {
        return window.location.pathname.includes('pages/');
    }

    static getBasePath() {
        return this.isSubPage() ? '../' : './';
    }

    static updateNavLinks() {
        const isSub = this.isSubPage();
        console.log('Updating nav links. Is subpage?', isSub);
        
        // 메인 네비게이션 링크 업데이트
        const navLinks = {
            'nav-logo': isSub ? '../index.html' : 'index.html',
            'nav-home': isSub ? '../index.html' : 'index.html',
            'nav-interest': isSub ? 'interest.html' : 'pages/interest.html',
            'nav-portfolio': isSub ? 'portfolio.html' : 'pages/portfolio.html'
        };

        // 각 링크에 대한 href 업데이트
        Object.entries(navLinks).forEach(([id, path]) => {
            const element = document.getElementById(id);
            if (element) {
                element.href = path;
                console.log(`Updated ${id} to ${path}`);
            } else {
                console.warn(`Element with id '${id}' not found`);
            }
        });
    }

    static updatePagination() {
        const isSub = this.isSubPage();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // 페이지 순서 정의
        const pageOrder = ['index.html', 'interest.html', 'portfolio.html'];
        
        // 현재 페이지 인덱스 찾기
        const currentIndex = pageOrder.findIndex(page => page === currentPage);
        
        if (currentIndex === -1) {
            console.warn('Current page not found in page order');
            return;
        }
        
        // 이전/다음 페이지 인덱스 계산 (순환)
        const prevIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
        const nextIndex = (currentIndex + 1) % pageOrder.length;
        
        // 이전/다음 페이지 경로 생성
        const getPagePath = (page) => {
            if (page === 'index.html') {
                return isSub ? '../index.html' : 'index.html';
            }
            return isSub ? page : `pages/${page}`;
        };
        
        const prevPage = pageOrder[prevIndex];
        const nextPage = pageOrder[nextIndex];
        
        // 이전/다음 버튼 업데이트
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.onclick = () => window.location.href = getPagePath(prevPage);
            prevBtn.style.visibility = 'visible';
            prevBtn.title = `이전: ${prevPage.replace('.html', '')}`;
        }
        
        if (nextBtn) {
            nextBtn.onclick = () => window.location.href = getPagePath(nextPage);
            nextBtn.style.visibility = 'visible';
            nextBtn.title = `다음: ${nextPage.replace('.html', '')}`;
        }
    }

    static async load(componentName, targetElementId) {
        try {
            const basePath = this.getBasePath();
            const componentPath = `${basePath}components/${componentName}.html`;
            console.log(`Loading component from: ${componentPath}`);
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태: ${response.status}, 경로: ${componentPath}`);
            }
            const html = await response.text();
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = html;
                // 네비게이션 링크 업데이트
                this.updateNavLinks();
                // 활성 링크 스타일 업데이트
                this.updateActiveLink();
                // 페이지네이션 컴포넌트 로드 (nav가 아닌 경우에만)
                if (componentName === 'nav') {
                    this.loadPagination();
                }
            } else {
                console.error(`Target element not found: ${targetElementId}`);
            }
        } catch (error) {
            console.error(`Error loading component (${componentName}):`, error);
        }
    }

    static async loadPagination() {
        try {
            const basePath = this.getBasePath();
            const paginationPath = `${basePath}components/pagination.html`;
            
            const response = await fetch(paginationPath);
            if (!response.ok) throw new Error(`Failed to load pagination`);
            
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
            this.updatePagination();
        } catch (error) {
            console.error('Error loading pagination:', error);
        }
    }

    static updateActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            // Handle different link formats
            const isCurrentPage = 
                linkPage === currentPage ||
                (linkHref.endsWith('index.html') && (currentPage === '' || currentPage === 'index.html')) ||
                (linkHref === './' && currentPage === 'index.html') ||
                (linkHref.includes('interest.html') && currentPage === 'interest.html') ||
                (linkHref.includes('portfolio.html') && currentPage === 'portfolio.html');

            if (isCurrentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}
