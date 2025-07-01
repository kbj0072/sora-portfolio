// AI 명언 카드 기능
// quotes.js에서 quotes 데이터를 가져옵니다

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayQuote() {
    const quote = getRandomQuote();
    document.getElementById('quoteText').textContent = '"' + quote.text + '"';
    document.getElementById('quoteAuthor').textContent = '— ' + quote.author;
}

// 투표 결과 업데이트 함수
function updateVoteResults() {
    const quotePercentage = (voteData.quote / voteData.total * 100).toFixed(1);
    const galleryPercentage = (voteData.gallery / voteData.total * 100).toFixed(1);
    
    document.getElementById('quoteResult').querySelector('.progress').style.width = `${quotePercentage}%`;
    document.getElementById('galleryResult').querySelector('.progress').style.width = `${galleryPercentage}%`;
    
    document.getElementById('quoteResult').querySelector('.percentage').textContent = `${quotePercentage}%`;
    document.getElementById('galleryResult').querySelector('.percentage').textContent = `${galleryPercentage}%`;
}

// 투표 데이터 초기화
let voteData = {
    quote: 0,
    gallery: 0,
    total: 0
};

document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지가 포트폴리오 페이지인지 확인
    if (window.location.pathname.includes('portfolio.html')) {
        // 로컬 스토리지에서 투표 데이터 불러오기
        const savedData = localStorage.getItem('voteData');
        if (savedData) {
            voteData = JSON.parse(savedData);
            updateVoteResults();
        }

        // 투표 폼 제출 이벤트 처리
        const voteForm = document.getElementById('voteForm');
        if (voteForm) {
            voteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 선택된 옵션 확인
                const selectedOption = document.querySelector('input[name="favorite"]:checked').value;
                
                // 투표 수 업데이트
                voteData[selectedOption]++;
                voteData.total++;
                
                // 로컬 스토리지에 저장
                localStorage.setItem('voteData', JSON.stringify(voteData));
                
                // 결과 업데이트
                updateVoteResults();
                
                // 폼 초기화
                voteForm.reset();
            });
        }

        // AI 그림 갤러리 초기화
        fetch('../json/gallery-data.json')
            .then(response => response.json())
            .then(data => {
                const galleryGrid = document.getElementById('galleryGrid');
                data.artworks.forEach(artwork => {
                    const card = document.createElement('div');
                    card.className = 'gallery-card';
                    card.innerHTML = `
                        <img src="../${artwork.image}" alt="${artwork.title}">
                        <div class="gallery-card-info">
                            <h4>${artwork.title}</h4>
                            <p>${artwork.description}</p>
                        </div>
                    `;
                    galleryGrid.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading gallery data:', error));
    }

    // AI 명언 카드 초기화
    displayQuote();
    document.getElementById('newQuoteButton').addEventListener('click', displayQuote);
});
