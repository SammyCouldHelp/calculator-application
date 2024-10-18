let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let lastButtonWasOperator = false;

const updateDisplay = () => {
    const display = document.getElementById('display');
    display.textContent = displayValue;
};

const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    lastButtonWasOperator = false;
};

const inputDecimal = () => {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    lastButtonWasOperator = false;
};

const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        if (nextOperator === '-') { // Handle negative numbers
            displayValue = '-';
            waitingForSecondOperand = false;
            return;
        }
        operator = nextOperator; // Update operator if it's not negative
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    lastButtonWasOperator = true;
};

const calculate = (first, second, operator) => {
    if (operator === '+') {
        return first + second;
    } else if (operator === '-') {
        return first - second;
    } else if (operator === 'x') {
        return first * second;
    } else if (operator === '/') {
        return first / second;
    }
    return second;
};

// Adjustments to ignore intermediate operators (except '-')
const handleConsecutiveOperators = (nextOperator) => {
    if (lastButtonWasOperator && nextOperator === '-') {
        displayValue = '-';
        waitingForSecondOperand = false;
        return;
    } else if (lastButtonWasOperator) {
        operator = nextOperator; // Always keep the last operator, except '-'
    }
};

// Handling button clicks
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const { id, textContent } = event.target;

        if (id === 'clear') {
            displayValue = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            lastButtonWasOperator = false;
        } else if (id === 'decimal') {
            inputDecimal();
        } else if (['add', 'subtract', 'multiply', 'divide'].includes(id)) {
            handleConsecutiveOperators(textContent);
            handleOperator(textContent);
        } else if (id === 'equals') {
            handleOperator(operator);
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            lastButtonWasOperator = false;
        } else {
            inputDigit(textContent);
        }

        updateDisplay();
    });
});
