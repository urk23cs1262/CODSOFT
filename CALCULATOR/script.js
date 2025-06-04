document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const previousCalculationDisplay = document.getElementById('previous-calculation');
    const buttons = document.querySelectorAll('.button');
    const historyList = document.getElementById('history-list');
    const noHistoryMessage = document.getElementById('no-history-message'); // Get the message element
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    let currentInput = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetDisplay = false;
    let history = []; // Array to store history objects { expression, result }

    // --- History Management ---

    function renderHistory() {
        historyList.innerHTML = ''; // Clear existing history

        if (history.length === 0) {
            noHistoryMessage.classList.remove('hidden'); // Show message if history is empty
        } else {
            noHistoryMessage.classList.add('hidden'); // Hide message if history has items
            history.forEach(item => {
                const historyItemDiv = document.createElement('div');
                historyItemDiv.classList.add('history-item');
                historyItemDiv.innerHTML = `
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">${item.result}</div>
                `;
                historyList.prepend(historyItemDiv); // Add new items to the top
            });
            // Scroll to the top to show the latest entry, as we are prepending
            historyList.scrollTop = 0;
        }
    }

    function addHistoryEntry(expression, result) {
        history.push({ expression, result });
        renderHistory(); // Always re-render history after adding
    }

    function clearHistory() {
        history = [];
        renderHistory(); // Re-render to show "no history yet" message
    }

    // --- Calculator Core Logic (remains mostly the same as your last correct version) ---

    function updateDisplay() {
        display.textContent = currentInput;
        previousCalculationDisplay.textContent = previousOperand + (operation || '');
    }

    function appendNumber(number) {
        if (shouldResetDisplay) {
            currentInput = number === '.' ? '0.' : number;
            shouldResetDisplay = false;
        } else if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else if (number === '.' && currentInput.includes('.')) {
            // Do nothing if decimal already exists
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    function handleOperator(op) {
        if (currentInput === '') return;

        if (previousOperand !== '' && operation !== null && !shouldResetDisplay) {
            calculate();
            previousOperand = display.textContent;
        } else if (currentInput !== '') {
            previousOperand = currentInput;
        }

        operation = op;
        shouldResetDisplay = true;
        updateDisplay();
    }

    function calculate() {
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentInput);
        let computation;

        if (isNaN(prev) || isNaN(current) || operation === null) {
            if (operation === null && previousOperand === '' && !isNaN(current)) {
                // Do nothing, currentInput is already the result
            } else {
                return;
            }
        }

        let expressionToStore = `${previousOperand} ${operation} ${currentInput}`;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    currentInput = 'Cannot divide by zero';
                    previousOperand = '';
                    operation = null;
                    shouldResetDisplay = true;
                    updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                computation = current;
                expressionToStore = currentInput;
                break;
        }

        currentInput = computation.toString();
        if (previousOperand !== '' || operation !== null) {
            addHistoryEntry(expressionToStore, currentInput);
        }

        previousOperand = '';
        operation = null;
        shouldResetDisplay = true;
        updateDisplay();
    }

    // --- Special Operations (same as your last correct version) ---

    function clearAll() {
        currentInput = '0';
        previousOperand = '';
        operation = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    function clearEntry() {
        currentInput = '0';
        shouldResetDisplay = false;
        updateDisplay();
    }

    function deleteLast() {
        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
            updateDisplay();
            return;
        }
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }

    function toggleSign() {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }

    function percentage() {
        const value = parseFloat(currentInput);
        if (isNaN(value)) return;

        if (previousOperand !== '' && operation) {
            const prev = parseFloat(previousOperand);
            let percentValue;
            if (operation === '+' || operation === '-') {
                percentValue = prev * (value / 100);
            } else {
                percentValue = value / 100;
            }
            currentInput = percentValue.toString();
        } else {
            currentInput = (value / 100).toString();
        }
        shouldResetDisplay = true;
        updateDisplay();
    }

    function reciprocal() {
        const value = parseFloat(currentInput);
        if (value === 0) {
            currentInput = 'Cannot divide by zero';
        } else {
            currentInput = (1 / value).toString();
        }
        shouldResetDisplay = true;
        updateDisplay();
    }

    function square() {
        const value = parseFloat(currentInput);
        currentInput = (value * value).toString();
        shouldResetDisplay = true;
        updateDisplay();
    }

    function squareRoot() {
        const value = parseFloat(currentInput);
        if (value < 0) {
            currentInput = 'Invalid input';
        } else {
            currentInput = Math.sqrt(value).toString();
        }
        shouldResetDisplay = true;
        updateDisplay();
    }

    // --- Event Listeners (same as your last correct version) ---

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.trim();
            const action = button.dataset.action;

            if (button.classList.contains('number') || button.classList.contains('decimal')) {
                appendNumber(buttonText);
            } else if (button.classList.contains('operator')) {
                handleOperator(buttonText);
            } else {
                switch (action) {
                    case 'equals':
                        calculate();
                        break;
                    case 'c':
                        clearAll();
                        break;
                    case 'ce':
                        clearEntry();
                        break;
                    case 'backspace':
                        deleteLast();
                        break;
                    case 'toggle-sign':
                        toggleSign();
                        break;
                    case 'percentage':
                        percentage();
                        break;
                    case 'reciprocal':
                        reciprocal();
                        break;
                    case 'square':
                        square();
                        break;
                    case 'sqrt':
                        squareRoot();
                        break;
                    default:
                        console.log(`Action: ${action} - Not implemented yet`);
                        break;
                }
            }
        });
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initial render of history
    renderHistory();
});