const square = document.querySelectorAll('.square');
const mole = document.querySelectorAll('.mole');
const timeLeft = document.querySelector('#time-left');
const button = document.querySelector('button');
const ReStartBtn = document.getElementById('reStartButton');
const Ul = document.getElementById('scoreUl');
let score = document.querySelector("#score");

const USERSCORE_KEY = "userscore";
const TIME_KEY = 10;
const RANK_KEY = 5;
let userScore = [];
let result = 0;
let currentTime = timeLeft.textContent;
let timer;
let Mole;
hitPosition = null;


// ------------------------- / 랜덤 장소 / ------------------------- //
function randomSquare() {
     square.forEach(className => {className.classList.remove('mole')});

    let randomPosition = square[Math.floor(Math.random() * 9)];
    randomPosition.classList.add('mole');

    hitPosition = randomPosition.id;
}


// ------------------------- / 점수 올리기 / ------------------------- //
square.forEach(id => {
    id.addEventListener('mouseup', () => {
        if(id.id === hitPosition) {
            result = result + 1;
            score.textContent = result;
            square.forEach(className => {className.classList.remove('mole')});
        }
    })
})


// ------------------------- / 시작 / ------------------------- //
function gameStart() {
    ReStartBtn.disabled = true;
    button.classList.add('hidden');
    ReStartBtn.classList.remove('hidden');
    timer = setInterval(countDown, 1000);
    Mole = setInterval(randomSquare, 700);

}


// ------------------------- / 재시작 / ------------------------- //
function ReGameStart() {
    if (confirm("게임을 재시작 하시겠습니까?")) {
        alert("재시작 합니다.");
        clear();
        timeLeft.textContent = TIME_KEY;
        currentTime = timeLeft.textContent;
        gameStart();
    } 
}


// ------------------------- / 초기화 / ------------------------- //
function clear() {
    square.forEach(className => {className.classList.remove('mole')});
    clearInterval(timer);
    clearInterval(Mole);
    result = 0;
    score.textContent = result;
    hitPosition = null;
}


// ------------------------- / 시간 감소 함수 / ------------------------- //
function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;
    let rankingCount = Ul.childElementCount;
    console.log(timeLeft);
    let timer = timeLeft.innerText;
    console.log(timer);

    if(currentTime === 0) {
        alert("게임 오버! 최종 점수 : " + result + "점");
        if (rankingCount < RANK_KEY) {
            add();
            paintUserScore();
            clear();
            ReStartBtn.disabled = false;
        } else {
            const lastLi = Ul.childNodes[rankingCount - 1];
            const lastScore = lastLi.childNodes[2].innerText; 
            if(result > lastScore){
                Delete(lastLi);
                add();
                paintUserScore();
            } else {
                alert("점수 부족^^ 다시 도전 하세요.");
                clear();
                ReStartBtn.disabled = false;
            }
        }
    }
}


// ------------------------- / 로컬 스토리지 저장 / ------------------------- //
function SaveScore() {
    localStorage.setItem(USERSCORE_KEY, JSON.stringify(userScore));
}


// ------------------------- / 삭제 / ------------------------- //
function Delete(event) {
    const li = event;
    const spanName = li.childNodes[1];
    const spanScore = li.childNodes[2];

    li.remove();
    userScore = userScore.filter((userScores) => userScores.score !== spanScore.innerText && userScores.name !== spanName.innerText);
    SaveScore();
}


// ------------------------- / 요소 추가 / ------------------------- //
function paintUserScore(list) {
    const userList = list;
    let Rank = Ul.childElementCount;
    const li = document.createElement("li");
    
    const ranking = document.createElement("p");
    if (Rank == 0 ){
        rankingName = "st";
    } else if (Rank == 1) {
        rankingName = "nd";
    } else if (Rank == 2) {
        rankingName = "rd";
    } else {
        rankingName = "th";
    }
    ranking.innerText = "< " + (Ul.childElementCount + 1) + rankingName +" >";

    const userSpan = document.createElement("span");
    userSpan.innerText = userList.name;
    userSpan.id = "userName";

    const scoreSpan = document.createElement("span");
    scoreSpan.innerText = userList.score;
    scoreSpan.classList = "score";

    li.appendChild(ranking);
    li.appendChild(userSpan);
    li.appendChild(scoreSpan);
    Ul.append(li);
}

// ------------------------- / 아이디 받기 / ------------------------- //
function add() {
    let userId = prompt("축하합니다! 점수를 등록합니다. 아이디를 입력하세요.");   
    if(userId == null || userId.trim() == "") { 
        userId = "guset#" + Date.now();
    }
    let scoreList = {
        name: userId,
        score: result,
    }
    userScore.push(scoreList);
    Sort();
}


// ------------------------- / 순위 정렬 / ------------------------- //
function Sort() {
    userScore.sort(function(a,b){
        return b.score - a.score;
    });
    SaveScore();
    location.reload();
}


const saveUserScore = localStorage.getItem(USERSCORE_KEY);

button.addEventListener('click', gameStart);
ReStartBtn.addEventListener('click', ReGameStart);

// ------------------------- / json 불러오기 / ------------------------- //
if (saveUserScore !== null) {
    const parsedUserScore = JSON.parse(saveUserScore);
    userScore = parsedUserScore;
    parsedUserScore.forEach(paintUserScore);
}