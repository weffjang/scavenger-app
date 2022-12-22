import React, { useState } from 'react';

export default function App() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [clueTries, setClueTries] = useState(0);
	const [penalty, setPenalty] = useState(0);

	const questions = [
		{
			questionText: 'What is the capital of France?',
			answerOptions: [
				{ answerText: 'Paris', isCorrect: true },
			],
		},
		{
			questionText: 'What is 1+1?',
			answerOptions: [
				{ answerText: '2', isCorrect: true },
				{ answerText: 'two', isCorrect: true }
			],
		},
		{
			questionText: 'What is Peter? Answer is yes',
			answerOptions: [
				{ answerText: 'yes', isCorrect: true },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '7', isCorrect: true },
			],
		},
	];

	const handleAnswerButtonClick = event => {
		const nextQuestion = currentQuestion + 1;
		let correct = false;
		console.log(clueTries);
		for (let i = 0; i < questions[currentQuestion].answerOptions.length; i++) {
			if (inputValue === questions[currentQuestion].answerOptions[i].answerText) {
				setInputValue('');
				correct = true;
				if (nextQuestion < questions.length) {
					setCurrentQuestion(nextQuestion);
				}
			}
		}
		if (!correct) {
			setClueTries(clueTries + 1);
		} else {
			setClueTries(0);
		}

		if (clueTries === 2) {
			setInputValue('');
			setClueTries(0);
			setCurrentQuestion(nextQuestion);
			setPenalty(penalty + 5);
		} 
		
		event.preventDefault();
	}

	const handleChange = event => {
		setInputValue(event.target.value);
	}

	return (
		<div className='app'>
			<div className='question-section'>
				<div className='question-count'>
					<span>Clue {currentQuestion + 1}</span>/{questions.length}
				</div>
				<div className='question-text'>{questions[currentQuestion].questionText}</div>
			</div>
			<div className='answer-section'>
				<form onSubmit={handleAnswerButtonClick}>
					<input type="text" value={inputValue} onChange={handleChange} />
					<input type="submit" value={'Submit'} className = "submitBtn"/>
				</form>
				<div>
					<span>Penalty: {penalty}</span>
				</div>
			</div>
		</div>
	);
}
