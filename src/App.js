import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase';

export default function App() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [clueTries, setClueTries] = useState(0);
	const [penalty, setPenalty] = useState(0);
	const [wrong, setWrong] = useState(false);
	const [scavState, setScavState] = useState('onboard');

	const Wrong = () => (
		<div id="wrong" className="wrong-text">
			Incorrect. {3 - clueTries} tries left.
		</div>
	)

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
			setWrong(true);
		} else {
			setClueTries(0);
			setWrong(false);
		}

		if (clueTries === 2) {
			setInputValue('');
			setClueTries(0);
			setCurrentQuestion(nextQuestion);
			setPenalty(penalty + 5);
		}
		
		saveData();
		
		event.preventDefault();
	}

	const handleChange = event => {
		setInputValue(event.target.value);
	}

	const saveData = async (e) => {       
        try {
            const docRef = await addDoc(collection(db, "team"), {
              name: "test",    
            });
            console.log("Document written with ID: ", docRef.id);
    	} catch (e) {
        	console.error("Error adding document: ", e);
        }
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
					{ wrong ? <Wrong /> : null }
				</div>
				<div>
					<span>Penalty: {penalty}</span>
				</div>
			</div>
		</div>
	);
}
