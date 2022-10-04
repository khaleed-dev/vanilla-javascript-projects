import Calculator from "./calculator.js";

const calc = new Calculator()

const UICalculator = document.querySelector('.calculator')
const outputPrimaryOperand = document.querySelector('[data-primary-operand]')
const outputSecondaryOperand = document.querySelector('[data-secondary-operand]')
const outputOperation = document.querySelector('[data-operation]')

outputPrimaryOperand.textContent = 0
let inputNumber = 0;
let primaryOperand;
let secondaryOperand;
let operation;

UICalculator.addEventListener('click', e => {
    if(e.target.matches('[data-number]')){
        inputNumber += e.target.textContent
        primaryOperand = Number(inputNumber)
        outputPrimaryOperand.textContent = primaryOperand
    }
    
    if(e.target.matches('[data-operation]')){
        // if there operation is already set, don't set it again and wait till user presses equals
        if(operation){
            return
        }
        operation = e.target.textContent
        secondaryOperand = primaryOperand
        primaryOperand = 0
        inputNumber = 0
        outputSecondaryOperand.textContent = secondaryOperand
        outputOperation.textContent = operation
        
    }
    if(e.target.matches('[data-equals]')){
        const result = calc.calculate(secondaryOperand, primaryOperand, operation)
        if(result){
            outputPrimaryOperand.textContent = result
            outputSecondaryOperand.textContent = ''
            outputOperation.textContent = ''
            primaryOperand = result
            secondaryOperand = 0
            operation = ''
            inputNumber = 0
            
        }
    }

    

    if(e.target.matches('[data-all-clear]')){
        primaryOperand = ''
        secondaryOperand = ''
        operation = ''
        inputNumber = '';
        outputPrimaryOperand.textContent = 0;
        outputSecondaryOperand.textContent = ''
        outputOperation.textContent = ''
    }
    if(e.target.matches('[data-del]')){

    }
})
