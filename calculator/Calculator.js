export default class Calculator {
    addition(primaryOperand, secondaryOperand){
        return primaryOperand + secondaryOperand
    }
    subtraction(primaryOperand, secondaryOperand){
        return primaryOperand - secondaryOperand
    }
    multiplication(primaryOperand, secondaryOperand){
        return primaryOperand * secondaryOperand
    }
    division(primaryOperand, secondaryOperand){
        return primaryOperand / secondaryOperand
    }
    calculate(primaryOperand, secondaryOperand, operation){
        let result;
        switch(operation){
            case '+':
                result = this.addition(primaryOperand, secondaryOperand)
                return result
            case '-':
                result = this.subtraction(primaryOperand, secondaryOperand)
                return result
            case '÷':
                result = this.division(primaryOperand, secondaryOperand)
                return result
            case '*':
                result = this.multiplication(primaryOperand, secondaryOperand)
                return result
        }
    }
}