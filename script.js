let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');
const addTimeButton = document.getElementById('add-time');

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
    document.getElementById('focus-task').classList.add('hidden');
    updateDisplay();
}

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes (300 seconds)
    updateDisplay();
}

function createFocusModal() {
    const modal = document.createElement('div');
    modal.className = 'focus-modal';
    modal.innerHTML = `
        <div class="focus-modal-content">
            <h2>What are you focusing on?</h2>
            <input type="text" id="focus-input" placeholder="Enter your focus task...">
            <div class="modal-buttons">
                <button id="focus-submit">Start Focusing</button>
                <button id="focus-cancel">Cancel</button>
            </div>
        </div>
    `;
    return modal;
}

function promptForFocusTask() {
    return new Promise((resolve) => {
        const modal = createFocusModal();
        document.body.appendChild(modal);
        
        const input = modal.querySelector('#focus-input');
        input.focus();

        // Function to close modal
        const closeModal = () => {
            document.body.removeChild(modal);
            resolve(false);
        };

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escapeHandler);
                closeModal();
            }
        });

        modal.querySelector('#focus-submit').addEventListener('click', () => {
            const task = input.value.trim();
            if (task) {
                const focusTaskElement = document.getElementById('focus-task');
                const focusTextElement = document.getElementById('focus-text');
                focusTextElement.textContent = task;
                focusTaskElement.classList.remove('hidden');
                document.body.removeChild(modal);
                resolve(true);
            }
        });

        modal.querySelector('#focus-cancel').addEventListener('click', closeModal);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modal.querySelector('#focus-submit').click();
            }
        });
    });
}

startButton.addEventListener('click', async () => {
    if (timerId === null) {
        if (!isWorkTime || !document.getElementById('focus-task').classList.contains('hidden') || await promptForFocusTask()) {
            startTimer();
        }
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

addTimeButton.addEventListener('click', addFiveMinutes);

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay();

// Initialize the toggle button text
toggleButton.className = 'work-mode'; 