// 전역 변수
let allInterests = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentSort = 'title-asc';
let currentSearch = '';
let currentTags = [];

// 아이콘 매핑
const iconMap = {
    'AI': 'fas fa-robot',
    '생성모델': 'fas fa-project-diagram',
    '예술': 'fas fa-palette',
    '인터랙션': 'fas fa-hand-pointer',
    '미디어아트': 'fas fa-photo-video',
    '프로세싱': 'fas fa-code',
    '데이터': 'fas fa-database',
    '시각화': 'fas fa-chart-bar',
    'D3.js': 'fab fa-js',
    '웹개발': 'fas fa-laptop-code',
    '프론트엔드': 'fas fa-code',
    'React': 'fab fa-react',
    '크리에이티브코딩': 'fas fa-laptop-code',
    'p5.js': 'fab fa-js',
    '기본': 'fas fa-heart'
};

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', () => {
    loadInterests();
    setupEventListeners();
});

// 관심사 데이터 로드
async function loadInterests() {
    try {
        const response = await fetch('../json/interests.json');
        const data = await response.json();
        allInterests = data.interests;
        displayInterests();
        setupTagFilters();
    } catch (error) {
        console.error('관심사 데이터를 불러오는 중 오류가 발생했습니다:', error);
        document.getElementById('interestsGrid').innerHTML = '<div class="error">데이터를 불러오는 중 오류가 발생했습니다.</div>';
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 버튼 클릭 이벤트
    document.getElementById('searchBtn').addEventListener('click', () => {
        currentSearch = document.getElementById('searchInput').value.toLowerCase();
        currentPage = 1;
        displayInterests();
    });

    // 엔터 키로 검색
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearch = e.target.value.toLowerCase();
            currentPage = 1;
            displayInterests();
        }
    });

    // 정렬 변경 이벤트
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        displayInterests();
    });
}

// 태그 필터 설정
function setupTagFilters() {
    const tagsContainer = document.getElementById('tagFilters');
    const allTags = [];
    
    // 모든 태그 수집
    allInterests.forEach(interest => {
        interest.tags.forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
    });
    
    // 태그 버튼 생성
    const tagButtons = allTags.map(tag => 
        `<button class="tag-btn" data-tag="${tag}">${tag}</button>`
    ).join('');
    
    tagsContainer.innerHTML = tagButtons;
    
    // 태그 클릭 이벤트
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                if (!currentTags.includes(tag)) {
                    currentTags.push(tag);
                }
            } else {
                currentTags = currentTags.filter(t => t !== tag);
            }
            
            currentPage = 1;
            displayInterests();
        });
    });
}

// 관심사 표시
function displayInterests() {
    const grid = document.getElementById('interestsGrid');
    const pagination = document.getElementById('pagination');
    
    // 로딩 표시
    grid.innerHTML = '<div class="loading">로딩 중...</div>';
    
    // 필터링 및 정렬
    let filteredInterests = [...allInterests];
    
    // 검색어로 필터링
    if (currentSearch) {
        filteredInterests = filteredInterests.filter(interest => 
            interest.title.toLowerCase().includes(currentSearch) || 
            interest.description.toLowerCase().includes(currentSearch) ||
            interest.tags.some(tag => tag.toLowerCase().includes(currentSearch))
        );
    }
    
    // 태그로 필터링
    if (currentTags.length > 0) {
        filteredInterests = filteredInterests.filter(interest => 
            currentTags.every(tag => interest.tags.includes(tag))
        );
    }
    
    // 정렬
    filteredInterests.sort((a, b) => {
        const [field, order] = currentSort.split('-');
        let comparison = 0;
        
        if (field === 'title') {
            comparison = a.title.localeCompare(b.title);
        } else if (field === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        
        return order === 'asc' ? comparison : -comparison;
    });
    
    // 페이지네이션
    const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInterests = filteredInterests.slice(startIndex, startIndex + itemsPerPage);
    
    // 카드 생성
    if (filteredInterests.length === 0) {
        grid.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
    } else {
        grid.innerHTML = paginatedInterests.map(interest => createInterestCard(interest)).join('');
    }
    
    // 페이지네이션 생성
    renderPagination(totalPages);
}

// 관심사 카드 생성
function createInterestCard(interest) {
    const icon = getIconForInterest(interest);
    const tags = interest.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
        <div class="interest-card">
            <div class="card-content">
                <i class="${icon}"></i>
                <h3>${interest.title}</h3>
                <p>${interest.description}</p>
                <div class="tags">${tags}</div>
            </div>
        </div>
    `;
}

// 관심사에 맞는 아이콘 반환
function getIconForInterest(interest) {
    // 태그에 따라 아이콘 결정
    for (const tag of interest.tags) {
        if (iconMap[tag]) {
            return iconMap[tag];
        }
    }
    return iconMap['기본'];
}

// 페이지네이션 렌더링
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let buttons = [];
    
    // 이전 버튼
    buttons.push(`
        <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            &laquo;
        </button>
    `);
    
    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
        buttons.push(`
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `);
    }
    
    // 다음 버튼
    buttons.push(`
        <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            &raquo;
        </button>
    `);
    
    pagination.innerHTML = buttons.join('');
}

// 페이지 변경
function changePage(page) {
    const totalPages = Math.ceil(
        document.querySelectorAll('.interest-card').length / itemsPerPage
    );
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayInterests();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 전역 함수로 노출
window.changePage = changePage;
