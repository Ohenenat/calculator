/* ===================================
   CALCULATOR CLASS
   =================================== */

class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // Add to history
        const historyEntry = `${prev} ${this.operation} ${current} = ${computation}`;
        this.addToHistory(historyEntry);

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    addToHistory(entry) {
        const historyList = document.getElementById('history-list');
        const listItem = document.createElement('li');
        listItem.textContent = entry;
        listItem.addEventListener('click', () => {
            const result = entry.split(' = ')[1];
            this.currentOperand = result;
            this.updateDisplay();
        });
        historyList.insertBefore(listItem, historyList.firstChild);

        // Keep history to max 10 items
        while (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand || '0';
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

/* ===================================
   THEME MANAGEMENT
   =================================== */

class ThemeManager {
    constructor() {
        this.themeDropdown = document.getElementById('theme-dropdown');
        this.loadTheme();
        this.themeDropdown.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
        this.setTheme(savedTheme);
        this.themeDropdown.value = savedTheme;
    }

    setTheme(theme) {
        document.body.className = '';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'blue') {
            document.body.classList.add('blue-theme');
        }
        localStorage.setItem('calculatorTheme', theme);
    }
}

/* ===================================
   INITIALIZATION
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Initialize theme manager
    new ThemeManager();

    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            document.getElementById('history-list').innerHTML = '';
        });
    }

    // Button event listeners
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operator]');
    const actionButtons = document.querySelectorAll('[data-action]');

    // Number buttons
    numberButtons.forEach((button) => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
        });
    });

    // Operation buttons
    operationButtons.forEach((button) => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operator);
        });
    });

    // Action buttons (AC, DEL, Decimal, Equals)
    actionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            switch (button.dataset.action) {
                case 'clear':
                    calculator.clear();
                    break;
                case 'delete':
                    calculator.delete();
                    break;
                case 'decimal':
                    calculator.appendNumber('.');
                    break;
                case 'equals':
                    calculator.compute();
                    break;
            }
        });
    });

    // Decimal button
    const decimalButton = document.querySelector('[data-action="decimal"]');
    if (decimalButton) {
        decimalButton.addEventListener('click', () => {
            calculator.appendNumber('.');
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            calculator.appendNumber(e.key);
        }
        // Decimal point
        else if (e.key === '.') {
            e.preventDefault();
            calculator.appendNumber('.');
        }
        // Operations
        else if (e.key === '+') {
            e.preventDefault();
            calculator.chooseOperation('+');
        } else if (e.key === '-') {
            e.preventDefault();
            calculator.chooseOperation('−');
        } else if (e.key === '*') {
            e.preventDefault();
            calculator.chooseOperation('×');
        } else if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
        } else if (e.key === '%') {
            e.preventDefault();
            calculator.chooseOperation('%');
        }
        // Enter for equals
        else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.compute();
        }
        // Backspace for delete
        else if (e.key === 'Backspace') {
            e.preventDefault();
            calculator.delete();
        }
        // Escape for clear
        else if (e.key === 'Escape') {
            e.preventDefault();
            calculator.clear();
        }
    });
});
