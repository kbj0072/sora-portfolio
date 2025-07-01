// 관심사 카드 자세히 보기 기능
function initializeInterestCards() {
    const interestCards = document.querySelectorAll('.interest-card');
    interestCards.forEach((card, index) => {
        const moreBtn = card.querySelector('.more-btn');
        moreBtn.addEventListener('click', () => {
            const descriptions = [
                "AI와 감성의 결합을 통한 창작 활동에 관심이 있습니다. 딥러닝 기술을 활용한 이미지 생성과 텍스트 생성에 대해 연구하고 있습니다.",
                "디지털 미디어를 통한 예술 표현에 관심이 있습니다. 프로그래밍을 활용한 인터랙티브 아트와 웹 기반 아트 프로젝트를 진행하고 있습니다.",
                "블록체인 기술을 활용한 디지털 아트의 새로운 가능성을 탐구하고 있습니다. NFT 아트와 디지털 자산의 가치 창출에 대해 연구하고 있습니다."
            ];
            alert(descriptions[index]);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeInterestCards();
});
