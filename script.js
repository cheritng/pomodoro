let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');

const WORK_TIME = 25 * 60; // 30 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title
    document.title = `${timeString} - Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    toggleButton.className = isWorkTime ? 'work-mode' : 'break-mode';
    updateDisplay();
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
            switchMode();
        }
    }, 1000);
    
    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    startButton.textContent = 'Start';
    updateDisplay();
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

toggleButton.addEventListener('click', () => {
    // Clear existing timer if running
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
    switchMode();
});

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay();

// Initialize the toggle button text
toggleButton.textContent = 'Switch to Break';
toggleButton.className = 'work-mode'; 